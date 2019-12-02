import { Room } from 'colyseus.js';
import {
  SendChatMessageData,
  Requests,
  BuyAccomplishmentCardData,
  SetTimeInvestmentData,
  SetNextPhaseData, ResetGameData
} from 'shared/requests';
import { InvestmentData } from 'shared/types';

export class RequestAPI {
  constructor(public room: Room) {}

  public send(req: Requests) {
    this.room.send(req);
  }

  public sendChatMessage(message: string) {
    const msg: SendChatMessageData = { message, kind: 'send-chat-message' };
    this.send(msg);
  }

  public setNextPhase() {
    const msg: SetNextPhaseData = { kind: "set-next-phase"};
    this.send(msg);
  }

  public resetGame() {
    const msg: ResetGameData = { kind: "reset-game" };
    this.send(msg);
  }

  public investTimeBlocks(investment: InvestmentData) {
    const msg: SetTimeInvestmentData = {...investment, kind: 'set-time-investment'};
    this.send(msg);
  }
}
