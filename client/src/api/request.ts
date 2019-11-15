import { Room } from 'colyseus.js';
import { SendChatMessage, Requests, BuyAccomplishmentCard } from 'shared/requests';

export class RequestAPI {
  constructor(public room: Room) {}

  public send(req: Requests) {
    this.room.send(req);
  }

  public sendChatMessage(message: string) {
    const msg: SendChatMessage = { message, kind: 'send-chat-message' };
    this.send(msg);
  }

  public buyAccomplishmentCard(id: number) {
    const msg: BuyAccomplishmentCard = { id, kind: 'buy-accomplishment-card' };
    this.send(msg);
  }
}
