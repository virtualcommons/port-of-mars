import { Client, Delayed, Room } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import * as http from "http";
import { MultiplayerGameState } from "@port-of-mars/server/rooms/pomlite/multiplayer/state";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import { InitGameCmd, ProcessRoundCmd, PlayerInvestCmd } from "./commands";
import { User } from "@port-of-mars/server/entity";
import { Invest, MultiplayerGameType } from "@port-of-mars/shared/lite";
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
    const roles = MultiplayerGameState.DEFAULTS.prolific.availableRoles!;
    const roleMap = new Map<Role, LitePlayerUser>();
    users.forEach((user, index) => {
      const role = roles[index % roles.length];
      roleMap.set(role, user);
    });
    return roleMap;
  }

  async onCreate(options: { type?: MultiplayerGameType; users: Array<LitePlayerUser> }) {
    logger.trace("MultiplayerGameRoom '%s' created", this.roomId);
    const type = options.type || "prolific";
    const userRoles = this.assignRoles(options.users);
    this.setState(new MultiplayerGameState({ type, userRoles }));
    // TODO: for the variance, we'll just assign a random/incrementing treatment to a game
    // and then in service.drawEventCardDeck() we'll just use the treatment to determine
    // draw amount for life as usual
    this.setPrivate(true);
    this.registerAllHandlers();
    this.dispatcher.dispatch(new InitGameCmd());
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
