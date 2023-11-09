import { LobbyRoomState } from "@port-of-mars/server/rooms/lobby/common/state";

export class TournamentLobbyRoomState extends LobbyRoomState {
  maxClients = 200;
}
