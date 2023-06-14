import { Client, Delayed, Room } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import * as http from "http";
import { SoloGameState } from "@port-of-mars/server/rooms/sologame/state";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import { ApplyCardCmd, InitGameCmd, InvestCmd, SetNextRoundCmd } from "./commands";
import { User } from "@port-of-mars/server/entity";

const logger = settings.logging.getLogger(__filename);

export class SoloGameRoom extends Room<SoloGameState> {
  public static get NAME() {
    return "solo_game_room";
  }
  autoDispose = true;
  maxClients = 1;
  patchRate = 1000 / 5; // sends state to client 5 times per second

  dispatcher = new Dispatcher(this);
  eventTimeout: Delayed | null = null;

  onCreate(options: any) {
    // do we need any options? most things are set up after onJoin is called
    logger.trace("SoloGameRoom '%s' created", this.roomId);
    this.setState(new SoloGameState());
    this.setPrivate(true);
    this.registerAllHandlers();
    this.clock.setInterval(() => {
      this.state.timeRemaining -= 1;
      if (this.state.timeRemaining <= 0) {
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
      logger.fatal("Unable to authenticate user: %s", e);
    }
    return false;
  }

  onJoin(client: Client, options: any, auth: User) {
    logger.trace("Client %s joined SoloGameRoom %s", auth.username, this.roomId);
    this.dispatcher.dispatch(new InitGameCmd());
  }

  onDispose() {
    this.dispatcher.stop();
  }

  registerAllHandlers() {
    this.onMessage("event-continue", (client, message) => {
      this.dispatcher.dispatch(new ApplyCardCmd().setPayload({ playerSkipped: true }));
    });
    this.onMessage("invest", (client, message) => {
      this.dispatcher.dispatch(
        new InvestCmd().setPayload({
          systemHealthInvestment: message.systemHealthInvestment,
          pointsInvestment: message.pointsInvestment,
        })
      );
    });
  }
}
