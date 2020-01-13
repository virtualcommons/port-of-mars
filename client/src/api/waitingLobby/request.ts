import { Room, Client } from 'colyseus.js';
import { WaitingRequests, SwitchRooms } from 'shared/waitingLobby/requests';

export class WaitingRequestAPI {
  room!: Room;

  connect(room: Room) {
    this.room = room;
  }

  public send(req: WaitingRequests) {
    this.room.send(req);
  }

  public joinRoom(room: string) {
    const msg: SwitchRooms = { kind: 'switch-rooms', room };
    this.send(msg);
  }

  public setNextPhase() {
    console.log('this shouldnt run...');
  }
}
