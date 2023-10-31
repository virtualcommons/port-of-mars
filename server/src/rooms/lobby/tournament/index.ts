import { Client, matchMaker } from "colyseus";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { Mutex } from "async-mutex";
import { buildGameOpts } from "@port-of-mars/server/util";
import { GameRoom } from "@port-of-mars/server/rooms/game";
import { settings } from "@port-of-mars/server/settings";
import { getServices } from "@port-of-mars/server/services";
import { TOURNAMENT_LOBBY_NAME, AcceptInvitation } from "@port-of-mars/shared/lobby";
import { TournamentLobbyRoomState } from "@port-of-mars/server/rooms/lobby/tournament/state";
import { LobbyClient } from "@port-of-mars/server/rooms/lobby/common/state";
import { LobbyRoom } from "@port-of-mars/server/rooms/lobby/common";

const logger = settings.logging.getLogger(__filename);

export class TournamentLobbyRoom extends LobbyRoom<TournamentLobbyRoomState> {
  roomName = TOURNAMENT_LOBBY_NAME;
  static get NAME() {
    return TOURNAMENT_LOBBY_NAME;
  }

  clockInterval = 1000 * 60; // try to form groups every 60 seconds

  private mutex = new Mutex();

  // track acceptance timeouts for each group to be able to clear them
  private groupTimeouts: Map<string, NodeJS.Timeout> = new Map();

  createState() {
    return new TournamentLobbyRoomState();
  }

  async trySendInvitations() {
    // only try to send invitations if there are enough players and we are not in the middle
    // of trying to put groups into a game
    const release = await this.mutex.acquire();
    try {
      this.formAndInviteGroups();
    } finally {
      release();
    }
  }

  async formAndInviteGroups() {
    while (this.state.queue.length >= this.groupSize) {
      const groupId = this.formGroup();
      const group = this.state.getPendingGroup(groupId);
      if (group) {
        await this.sendGroupInvitations(group);
        this.setGroupAcceptanceTimeout(groupId);
      }
    }
  }

  setGroupAcceptanceTimeout(groupId: string) {
    // set a timeout for 10 seconds to accept the invitation, otherwise assume something
    // bad happened and clear the group
    const timeout = setTimeout(() => {
      if (!this.state.allGroupClientsAccepted(groupId)) {
        this.state.resetPendingGroup(groupId);
      }
      this.groupTimeouts.delete(groupId);
    }, 1000 * 10);
    this.groupTimeouts.set(groupId, timeout);
  }

  clearGroupAcceptanceTimeout(groupId: string) {
    const timeout = this.groupTimeouts.get(groupId);
    if (timeout) {
      clearTimeout(timeout);
      this.groupTimeouts.delete(groupId);
    }
  }

  formGroup(): string {
    const group = [];
    const groupId = uuidv4();
    _.shuffle(this.state.queue);
    for (let i = 0; i < this.groupSize; i++) {
      const client = this.state.queue.pop()!;
      client.accepted = true;
      group.push(client);
    }
    this.state.setPendingGroup(groupId, group);
    return groupId;
  }

  async sendGroupInvitations(group: LobbyClient[]) {
    const usernames = group.map(client => client.username);
    const gameOpts = await buildGameOpts(usernames, "tournament");
    const room = await matchMaker.createRoom(GameRoom.NAME, gameOpts);
    logger.info(`${this.roomName} created game room ${room.roomId}`);
    // send room data for new websocket connection
    group.forEach((lobbyClient: LobbyClient) => {
      this.sendSafe(lobbyClient.client, {
        kind: "sent-invitation",
        roomId: room.roomId,
      });
    });
  }

  async isLobbyOpen() {
    const services = getServices();
    if (await services.settings.isTournamentEnabled()) {
      return services.tournament.isLobbyOpen();
    }
    return false;
  }

  async canClientJoin(client: Client) {
    const services = getServices();
    const numberOfActiveParticipants = await services.game.getNumberOfActiveParticipants();
    const maxConnections = await this.getMaxConnections();
    return (
      numberOfActiveParticipants < maxConnections && services.tournament.canPlayInRound(client.auth)
    );
  }

  onAcceptInvitation(client: Client, message: AcceptInvitation) {
    logger.trace(`client ${client.auth.username} accepted invitation to join a game`);
    this.state.setClientAccepted(client.auth.username);
    const groupId = this.state.getClientPendingGroupId(client);
    // check that all clients in the group have accepted the invitation
    if (!groupId) {
      logger.warn(`no client group found for client ${client.auth.username}`);
      return;
    }
    const group = this.state.getPendingGroup(groupId);
    if (group && this.state.allGroupClientsAccepted(groupId)) {
      this.clearGroupAcceptanceTimeout(groupId);
      group.forEach((lc: LobbyClient) => {
        this.sendSafe(lc.client, { kind: "removed-client-from-lobby" });
        lc.client.leave();
      });
      this.state.pendingGroups.delete(groupId);
    }
  }

  onLeave(client: Client, consented: boolean) {
    // cleans up the client state
    super.onLeave(client, consented);
    // if a client in a pending group leaves, reset all other clients in the group
    const groupId = this.state.getClientPendingGroupId(client);
    if (groupId) {
      this.state.resetPendingGroup(groupId, client);
    }
  }
}
