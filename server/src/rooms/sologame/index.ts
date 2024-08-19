import { Client, Delayed, Room } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import * as http from "http";
import { SoloGameState } from "@port-of-mars/server/rooms/sologame/state";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import { ApplyCardCmd, InitGameCmd, InvestCmd, PersistRoundCmd, SetNextRoundCmd } from "./commands";
import { User } from "@port-of-mars/server/entity";
import { EventContinue, Invest, SOLO_ROOM_NAME, SoloGameType } from "@port-of-mars/shared/sologame";

const logger = settings.logging.getLogger(__filename);

export class SoloGameRoom extends Room<SoloGameState> {
  public static get NAME() {
    return SOLO_ROOM_NAME;
  }
  autoDispose = true;
  maxClients = 1;
  patchRate = 1000 / 5; // sends state to client 5 times per second

  dispatcher = new Dispatcher(this);
  eventTimeout: Delayed | null = null;

  get client() {
    return this.clients[0];
  }

  onCreate(options: { type?: SoloGameType }) {
    logger.trace("SoloGameRoom '%s' created", this.roomId);
    this.setState(new SoloGameState());
    this.state.type = options.type || "freeplay";
    this.setPrivate(true);
    this.registerAllHandlers();
    this.clock.setInterval(() => {
      if (this.state.timeRemaining > 0) {
        this.state.timeRemaining -= 1;
      } else if (!this.state.isRoundTransitioning) {
        this.dispatcher.dispatch(
          new PersistRoundCmd().setPayload({
            systemHealthInvestment: 0,
            pointsInvestment: 0,
          })
        );
        this.dispatcher.dispatch(new SetNextRoundCmd());
      }
    }, 1000);
  }

  async onAuth(client: Client, options: any, request?: http.IncomingMessage) {
    try {
      const user = await getServices().account.findUserById((request as any).session.passport.user);
      if (user.isBanned) {
        logger.info("Banned user %s attempted to join", user.username);
        return false;
      }
      return user;
    } catch (e) {
      logger.fatal("Unable to authenticate user");
      logger.fatal(e as Error);
    }
    return false;
  }

  onJoin(client: Client, options: any, auth: User) {
    logger.trace("Client %s joined SoloGameRoom %s", auth.username, this.roomId);
    this.dispatcher.dispatch(new InitGameCmd().setPayload({ user: auth }));
  }

  onDispose() {
    logger.trace("Disposing of SoloGameRoom '%s'", this.roomId);
    this.dispatcher.stop();
  }

  registerAllHandlers() {
    this.onMessage("event-continue", (client, message: EventContinue) => {
      this.dispatcher.dispatch(new ApplyCardCmd().setPayload({ playerSkipped: true }));
    });
    this.onMessage("invest", (client, message: Invest) => {
      this.dispatcher.dispatch(
        new InvestCmd().setPayload({
          systemHealthInvestment: message.systemHealthInvestment,
        })
      );
    });
  }
}
