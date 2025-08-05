import { Client, Delayed, Room } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import * as http from "http";
import { LiteGameState } from "@port-of-mars/server/rooms/pomlite/multiplayer/state";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import { User } from "@port-of-mars/server/entity";
import { Invest, LiteGameType, Vote } from "@port-of-mars/shared/lite";
import { LitePlayerUser, LiteRoleAssignment, Role } from "@port-of-mars/shared/types";
import { EndGameCmd, InitGameCmd, PlayerInvestCmd, SetFirstRoundCmd } from "./commands";

const logger = settings.logging.getLogger(__filename);

export class LiteGameRoom extends Room<LiteGameState> {
  public static get NAME() {
    return "multiplayer_game_room";
  }

  autoDispose = false;
  maxClients = 5; // default, should be set to state.numPlayers
  patchRate = 1000 / 5;

  dispatcher = new Dispatcher(this);
  eventTimeout: Delayed | null = null;

  private assignRoles(users: Array<LitePlayerUser>): LiteRoleAssignment {
    const roles = LiteGameState.DEFAULTS.prolificBaseline.availableRoles!;
    const roleMap = new Map<Role, LitePlayerUser>();
    users.forEach((user, index) => {
      const role = roles[index % roles.length];
      roleMap.set(role, user);
    });
    return roleMap;
  }

  startGameLoop() {
    this.clock.setInterval(() => {
      if (this.state.isWaitingToStart) {
        if (this.state.timeRemaining > 0) {
          this.state.timeRemaining -= 1;
        }
        // start if every player clicked ready or time is up
        if (
          [...this.state.players.values()].every(p => p.isReadyToStart) ||
          this.state.timeRemaining <= 0
        ) {
          this.state.isWaitingToStart = false;
          this.dispatcher.dispatch(new SetFirstRoundCmd());
        }
        return;
      }
      if (this.state.timeRemaining > 0) {
        this.state.timeRemaining -= 1;
      } else if (!this.state.isRoundTransitioning) {
        this.state.players.forEach(player => {
          // for all players that have timed out, invest 0
          if (player.pendingInvestment < 0) {
            this.dispatcher.dispatch(
              new PlayerInvestCmd().setPayload({
                systemHealthInvestment: 0,
                clockRanOut: true,
                player: player,
              })
            );
          }
        });
      }
    }, 1000);
  }

  async onCreate(options: { type?: LiteGameType; users: Array<LitePlayerUser> }) {
    logger.trace("LiteGameRoom '%s' created", this.roomId);
    const type = options.type || "prolificBaseline";
    const userRoles = this.assignRoles(options.users);
    this.setState(new LiteGameState({ type, userRoles }));
    this.maxClients = this.state.numPlayers;
    this.setPrivate(true);
    this.registerAllHandlers();
    this.dispatcher.dispatch(new InitGameCmd());
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

  async onJoin(client: Client, options: any, auth: User) {
    logger.trace("Client %s joined LiteGameRoom %s", auth.username, this.roomId);
    const player = this.state.getPlayer(client);
    const { multiplayerStudy } = getServices();
    await multiplayerStudy.setParticipantAbandonedGame(player.userId, false);
    if (this.state.isRoundInitialized) {
      client.send("set-hidden-params", {
        kind: "set-hidden-params",
        data: this.state.buildHiddenParams(),
      });
    }
  }

  async onLeave(client: Client, consented: boolean) {
    const player = this.state.getPlayer(client);
    const { multiplayerStudy } = getServices();
    // if the game is still in progress and the player closed the tab, mark them as having abandoned the game
    if (this.state.status === "incomplete" && !consented) {
      await multiplayerStudy.setParticipantAbandonedGame(player.userId, true);
    }
    // if no one is left, finish the game
    if (this.clients.length === 0 && this.state.status === "incomplete") {
      this.dispatcher.dispatch(new EndGameCmd().setPayload({ status: "defeat", abandoned: true }));
    }
  }

  async onDispose(): Promise<void> {
    logger.trace("Disposing of LiteGameRoom '%s'", this.roomId);
    this.dispatcher.stop();
  }

  registerAllHandlers() {
    this.onMessage("vote", (client: Client, message: Vote) => {
      // TODO: record the player's vote/apply to event handling
    });
    this.onMessage("player-ready", (client: Client) => {
      const player = this.state.getPlayer(client);
      player.isReadyToStart = true;
    });
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
