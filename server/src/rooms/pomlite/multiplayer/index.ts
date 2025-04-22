import { Client, Delayed, Room } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import * as http from "http";
import { MultiplayerGameState } from "@port-of-mars/server/rooms/pomlite/multiplayer/state";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import { InitGameCmd, ProcessRoundCmd, PlayerInvestCmd } from "./commands";
import { User } from "@port-of-mars/server/entity";
import { Invest, LiteGameType } from "@port-of-mars/shared/lite";
import { settings as sharedSettings } from "@port-of-mars/shared/settings";
import { LitePlayerUser, LiteRoleAssignment, Role } from "@port-of-mars/shared/types";

const logger = settings.logging.getLogger(__filename);

export class MultiplayerGameRoom extends Room<MultiplayerGameState> {
  public static get NAME() {
    return "multiplayer_game_room";
  }

  autoDispose = true;
  // FIXME: this should be based on the game type, we can do this by
  // throwing it in the data structure that holds events, etc for each type
  maxClients = sharedSettings.LITE_MULTIPLAYER_PLAYERS_COUNT;
  patchRate = 1000 / 5;

  dispatcher = new Dispatcher(this);
  eventTimeout: Delayed | null = null;

  private assignRoles(users: Array<LitePlayerUser>): LiteRoleAssignment {
    const roles = MultiplayerGameState.DEFAULTS.prolificBaseline.availableRoles!;
    const roleMap = new Map<Role, LitePlayerUser>();
    users.forEach((user, index) => {
      const role = roles[index % roles.length];
      roleMap.set(role, user);
    });
    return roleMap;
  }

  async onCreate(options: { type?: LiteGameType; users: Array<LitePlayerUser> }) {
    logger.trace("MultiplayerGameRoom '%s' created", this.roomId);
    const type = options.type || "prolificBaseline";
    const userRoles = this.assignRoles(options.users);
    this.setState(new MultiplayerGameState({ type, userRoles }));
    this.setPrivate(true);
    this.registerAllHandlers();
    this.dispatcher.dispatch(new InitGameCmd());
    this.clock.setInterval(() => {
      if (this.state.timeRemaining > 0) {
        this.state.timeRemaining -= 1;
      } else if (!this.state.isRoundTransitioning) {
        this.state.players.forEach(player => {
          // FIXME: what should this be?????
          player.pendingInvestment = 0;
          player.pointsEarned = 0;
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

  onJoin(client: Client, options: any, auth: User) {
    logger.trace("Client %s joined MultiplayerGameRoom %s", auth.username, this.roomId);
  }

  async onDispose(): Promise<void> {
    logger.trace("Disposing of MultiplayerGameRoom '%s'", this.roomId);
    this.dispatcher.stop();
  }

  registerAllHandlers() {
    this.onMessage("invest", (client: Client, message: Invest) => {
      const player = this.state.getPlayer(client);
      this.dispatcher.dispatch(
        new PlayerInvestCmd().setPayload({
          systemHealthInvestment: message.systemHealthInvestment,
          player,
        })
      );
    });
  }
}
