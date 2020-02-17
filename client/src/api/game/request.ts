import { Client, Room } from 'colyseus.js';
import {
  Requests,
  SendChatMessageData,
  SetPlayerReadinessData,
  SetNextPhaseData,
  ResetGameData,
  SetTimeInvestmentData,
  BuyAccomplishmentCardData,
  DiscardAccomplishmentCardData,
  SendTradeRequestData,
  AcceptTradeRequestData,
  RejectTradeRequestData,
  PersonalGainVotesData, VoteForPhilanthropistData, 
  OutOfCommissionCuratorData,
  DeleteNotificationData
} from 'shared/requests';
import {
  AccomplishmentData,
  InvestmentData,
  TradeData,
  Role
} from 'shared/types';
import { MockRoom } from '@/types/tutorial';

export class GameRequestAPI {
  room!: Room | MockRoom;

  public connect(room: Room | MockRoom) {
    this.room = room;
  }

  public send(req: Requests) {
    this.room.send(req);
  }

  public sendChatMessage(message: string) {
    console.log('SEND CHAT MESSAGE: ', message);
    const msg: SendChatMessageData = { message, kind: 'send-chat-message' };
    console.log(msg);
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
    const msg: RejectTradeRequestData = { kind: 'reject-trade-request', id };
    this.send(msg);
  }

  public setPlayerReadiness(value: boolean) {
    const msg: SetPlayerReadinessData = { kind: 'set-player-readiness', value };
    this.send(msg);
  }

  public savePersonalGainVote(value: { role: Role, vote: boolean }) {
    const msg: PersonalGainVotesData = { kind: 'personal-gain', value };
    this.send(msg);
  }

  public voteForPhilanthropist(vote: Role) {
    const msg: VoteForPhilanthropistData = { kind: 'vote-for-philanthropist', vote };
    this.send(msg);
  }

  public deleteNotification(index: number){
    const msg: DeleteNotificationData = {kind: 'delete-notification', index};
    this.send(msg);
  }
}
