import { Client, Delayed, Room } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import * as http from "http";
import { TrioGameState, Player } from "@port-of-mars/server/rooms/triogame/state";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import {
  ApplyCardCmd,
  InitGameCmd,
  SetPlayerCmd,
  ProcessRoundCmd,
  PlayerInvestCmd,
} from "./commands";
import { User } from "@port-of-mars/server/entity";
import { EventContinue, Invest } from "@port-of-mars/shared/sologame";
import { TrioGameOpts } from "@port-of-mars/server/rooms/triogame/types";

const logger = settings.logging.getLogger(__filename);

export class TrioGameRoom extends Room<TrioGameState> {
  public static get NAME() {
    return "trio_game_room";
  }

  autoDispose = true;
  maxClients = 3;
  patchRate = 1000 / 5;

  dispatcher = new Dispatcher(this);
  eventTimeout: Delayed | null = null;

  async onCreate(options: TrioGameOpts) {
    logger.trace("TrioGameRoom '%s' created", this.roomId);
    this.setState(new TrioGameState(options));
    this.state.type = options.type || "freeplay";
    this.setPrivate(true);
    this.registerAllHandlers();
    new InitGameCmd().setPayload({ users: options.users });
    this.clock.setInterval(() => {
      if (this.state.timeRemaining > 0) {
        this.state.timeRemaining -= 1;
      } else if (!this.state.isRoundTransitioning) {
        this.state.players.forEach(player => {
          player.pendingInvestment = null;
          player.pointsEarned = null;
          this.dispatcher.dispatch(
            new PlayerInvestCmd().setPayload({
              systemHealthInvestment: 0,
              clockRanOut: true,
              player: player,
            })
          );
        });
        this.dispatcher.dispatch(new ProcessRoundCmd());
      }
    }, 1000);
  }

  // maybe add a safeguard to ensure client belongs to this room
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

  getPlayer(client: Client): Player {
    return this.state.getPlayer(client.auth.username);
  }

  onJoin(client: Client, options: any, auth: User) {
    logger.trace("Client %s joined TrioGameRoom %s", auth.username, this.roomId);
    this.dispatcher.dispatch(new SetPlayerCmd().setPayload({ users: [auth] }));
  }

  async onDispose(): Promise<void> {
    logger.trace("Disposing of TrioGameRoom '%s'", this.roomId);
    this.dispatcher.stop();
  }

  registerAllHandlers() {
    this.onMessage("event-continue", (client, message: EventContinue) => {
      this.dispatcher.dispatch(new ApplyCardCmd().setPayload({ playerSkipped: true }));
    });
    this.onMessage("invest", (client, message: Invest) => {
      this.state.getPlayer();
      this.dispatcher.dispatch(
        new PlayerInvestCmd().setPayload({
          systemHealthInvestment: message.systemHealthInvestment,
        })
      );
    });
  }
}
