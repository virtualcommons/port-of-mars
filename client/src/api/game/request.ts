import { Room } from 'colyseus.js';
import {
  Requests,
  SendChatMessageData,
  SetPlayerReadinessData,
  SetNextPhaseData,
  ResetGameData,
  SetTimeInvestmentData,
  PurchaseAccomplishmentCardData,
  DiscardAccomplishmentCardData,
  SendTradeRequestData,
  AcceptTradeRequestData,
  RejectTradeRequestData,
  CancelTradeRequestData,
  PersonalGainVotesData,
  VoteForPhilanthropistData,
  BondingThroughAdversityData,
  BreakdownOfTrustData
} from '@port-of-mars/shared/game/requests';
import {
  AccomplishmentData,
  InvestmentData,
  TradeData,
  Role,
  Resource
} from '@port-of-mars/shared/types';
import { MockRoom } from '@port-of-mars/client/types/tutorial';

export class GameRequestAPI {
  room!: Room | MockRoom;

  public connect(room: Room | MockRoom) {
    this.room = room;
  }

  public send(req: Requests) {
    this.room.send(req);
  }

  public sendChatMessage(message: string) {
    // console.log('SEND CHAT MESSAGE: ', message);
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
    const msg: PurchaseAccomplishmentCardData = {
      kind: 'purchase-accomplishment-card',
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

  public cancelTradeRequest(id: string) {
    const msg: CancelTradeRequestData = { kind: 'cancel-trade-request', id };
    this.send(msg);
  }

  public setPlayerReadiness(value: boolean) {
    const msg: SetPlayerReadinessData = { kind: 'set-player-readiness', value };
    this.send(msg);
  }

  public savePersonalGainVote(value: { role: Role; vote: boolean }) {
    const msg: PersonalGainVotesData = { kind: 'personal-gain', value };
    this.send(msg);
  }

  public voteForPhilanthropist(vote: Role) {
    const msg: VoteForPhilanthropistData = {
      kind: 'vote-for-philanthropist',
      vote
    };
    this.send(msg);
  }

  public saveBondingThroughAdversitySelection(influenceVoteData: {
    role: Role;
    influence: Resource;
  }) {
    const msg: BondingThroughAdversityData = {
      kind: 'bonding-through-adversity',
      influenceVoteData
    };
    this.send(msg);
  }

  public saveResourcesSelection(savedResources: InvestmentData) {
    const msg: BreakdownOfTrustData = {
      kind: 'breakdown-of-trust',
      savedResources
    };
    this.send(msg);
  }
}
