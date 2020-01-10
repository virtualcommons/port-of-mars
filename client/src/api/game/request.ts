import { Room } from 'colyseus.js';
import {
  SendChatMessageData,
  Requests,
  BuyAccomplishmentCardData,
  SetTimeInvestmentData,
  SetNextPhaseData,
  ResetGameData,
  DiscardAccomplishmentCardData,
  SendTradeRequestData,
  AcceptTradeRequestData,
  RejectTradeRquestData,
  SetPlayerReadinessData
} from 'shared/requests';
import {
  AccomplishmentData,
  InvestmentData,
  TradeData,
  Role
} from 'shared/types';

export class GameRequestAPI {
  constructor(public room: Room) {}

  public send(req: Requests) {
    this.room.send(req);
  }

  public sendChatMessage(message: string) {
    const msg: SendChatMessageData = { message, kind: 'send-chat-message' };
    this.send(msg);
  }

  public setNextPhase() {
    const msg: SetNextPhaseData = { kind: 'set-next-phase' };
    this.send(msg);
  }

  public resetGame() {
    const msg: ResetGameData = { kind: 'reset-game' };
    this.send(msg);
  }

  public investTimeBlocks(investment: InvestmentData) {
    const msg: SetTimeInvestmentData = {
      ...investment,
      kind: 'set-time-investment'
    };
    this.send(msg);
  }

  public purchaseAccomplishment(accomplishment: AccomplishmentData) {
    const msg: BuyAccomplishmentCardData = {
      kind: 'buy-accomplishment-card',
      id: accomplishment.id
    };
    this.send(msg);
  }

  public discardAccomplishment(id: number) {
    const msg: DiscardAccomplishmentCardData = {
      kind: 'discard-accomplishment-card',
      id
    };
    this.send(msg);
  }

  public sendTradeRequest(trade: TradeData) {
    const msg: SendTradeRequestData = { kind: 'send-trade-request', trade };
    this.send(msg);
  }

  public acceptTradeRequest(id: string) {
    const msg: AcceptTradeRequestData = { kind: 'accept-trade-request', id };
    this.send(msg);
  }

  public rejectTradeRequest(id: string) {
    const msg: RejectTradeRquestData = { kind: 'reject-trade-request', id };
    this.send(msg);
  }

  public setPlayerReadiness(value: boolean) {
    const msg: SetPlayerReadinessData = { kind: 'set-player-readiness', value };
    this.send(msg);
  }
}
