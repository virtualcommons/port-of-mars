import { Room, Client } from 'colyseus.js';
import {
  WaitingRequests,
  AcceptInvitation,
  SwitchRooms
} from 'shared/waitingLobby/requests';

export class WaitingRequestAPI {
  room!: Room;

  connect(room: Room) {
    this.room = room;
  }

  public send(req: WaitingRequests) {
    this.room.send(req);
  }

  public acceptInvitation() {
    const msg: AcceptInvitation = { kind: 'accept-invitation' };
    this.send(msg);
  }

  public joinRoom(room: string) {
    const msg: SwitchRooms = { kind: 'switch-rooms', room };
    this.send(msg);
  }
}
