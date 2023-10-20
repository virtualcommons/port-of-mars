import { LobbyRoomState } from "@port-of-mars/server/rooms/lobby/common/state";

/**
 * Lobby room state for tournaments that continues to fill up and send out games once it
 * reaches 5 players
 */
export class TournamentLobbyRoomState extends LobbyRoomState {
  maxClients = 100;
}
