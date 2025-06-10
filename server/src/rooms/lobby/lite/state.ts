import { LobbyRoomState } from "@port-of-mars/server/rooms/lobby/common/state";

export class LiteLobbyRoomState extends LobbyRoomState {
  maxClients = 200;
}
