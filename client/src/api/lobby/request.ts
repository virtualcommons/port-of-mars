import { Room, Client } from 'colyseus.js';
import {
  WaitingRequests,
  AcceptInvitation,
  DistributeGroups
} from '@port-of-mars/shared/lobby/requests';

export class WaitingRequestAPI {
  room!: Room;

  connect(room: Room) {
    this.room = room;
  }

  public leave() {
    if (this.room) {
      this.room.leave();
    }
  }

  public send(req: WaitingRequests) {
    this.room.send(req);
  }

  public acceptInvitation() {
    const msg: AcceptInvitation = { kind: 'accept-invitation' };
    this.send(msg);
  }

  public distributeGroups() {
    const msg: DistributeGroups = { kind: 'distribute-groups' };
    this.send(msg);
  }
}
