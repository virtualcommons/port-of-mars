import { LobbyRoomState } from "@port-of-mars/server/rooms/lobby/common/state";

export class ClassroomLobbyRoomState extends LobbyRoomState {
  maxClients = 200;
}
