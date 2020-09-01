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
  StageDiscardOfPurchasedAccomplishmentCardData,
  BreakdownOfTrustData, ResetBotWarningData, VoteHeroOrPariahData, VoteHeroOrPariahRoleData,
} from '@port-of-mars/shared/game/requests';
import {
  AccomplishmentData,
  InvestmentData,
  TradeData,
  Role,
  Resource,
  ResourceAmountData,
} from '@port-of-mars/shared/types';
import {
  ChatMarsLogView,
  HUDLeftView,
  HUDRightView,
} from '@port-of-mars/shared/game/client/panes';
import { MockRoom } from '@port-of-mars/client/types/tutorial';
import { TStore } from '@port-of-mars/client/plugins/tstore';
import {AbstractGameAPI} from "@port-of-mars/client/api/game/types";
import { defaultPendingInvestment } from '@port-of-mars/shared/game/client/state';

export class GameRequestAPI implements AbstractGameAPI {
  room!: Room | MockRoom;
  private store!: TStore;

  public connect(room: Room | MockRoom, store: TStore) {
    this.room = room;
    this.store = store;
  }

  public send(req: Requests) {
    this.room.send(req.kind, req);
  }

  public resetPendingInvestments() {
    this.store.commit('SET_PENDING_INVESTMENTS', { role: this.store.state.role, data: defaultPendingInvestment() });
  }

  public resetBotWarning() {
    const msg: ResetBotWarningData = { kind: 'reset-bot-warning' };
    this.send(msg);
  }

  public sendChatMessage(message: string) {
    // console.log('SEND CHAT MESSAGE: ', message);
    const msg: SendChatMessageData = {
      message,
      kind: 'send-chat-message',
    };
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
      kind: 'set-time-investment',
    };
    this.send(msg);
  }

  public purchaseAccomplishment(accomplishment: AccomplishmentData) {
    const msg: PurchaseAccomplishmentCardData = {
      kind: 'purchase-accomplishment-card',
      id: accomplishment.id,
    };
    this.send(msg);
  }

  public discardAccomplishment(id: number) {
    const msg: DiscardAccomplishmentCardData = {
      kind: 'discard-accomplishment-card',
      id,
    };
    this.send(msg);
  }

  public stageDiscardOfPurchasedAccomplishment(id: number) {
    const msg: StageDiscardOfPurchasedAccomplishmentCardData = {
      kind: 'stage-discard-of-purchased-accomplishment-card',
      id
    };
    this.send(msg);
  }

  public sendTradeRequest(trade: SendTradeRequestData['trade']) {
    const msg: SendTradeRequestData = {
      kind: 'send-trade-request',
      trade,
    };
    this.send(msg);
  }

  public acceptTradeRequest(id: string) {
    const msg: AcceptTradeRequestData = {
      kind: 'accept-trade-request',
      id,
    };
    this.send(msg);
  }

  public rejectTradeRequest(id: string) {
    const msg: RejectTradeRequestData = {
      kind: 'reject-trade-request',
      id,
    };
    this.send(msg);
  }

  public cancelTradeRequest(id: string) {
    const msg: CancelTradeRequestData = {
      kind: 'cancel-trade-request',
      id,
    };
    this.send(msg);
  }

  public setPlayerReadiness(value: boolean) {
    const msg: SetPlayerReadinessData = {
      kind: 'set-player-readiness',
      value,
    };
    this.send(msg);
  }

  public savePersonalGainVote(vote: boolean) {
    const msg: PersonalGainVotesData = { kind: 'personal-gain', vote };
    this.send(msg);
  }

  public voteForPhilanthropist(vote: Role) {
    const msg: VoteForPhilanthropistData = {
      kind: 'vote-for-philanthropist',
      vote,
    };
    this.send(msg);
  }

  public saveBondingThroughAdversitySelection(influenceVoteData: {
    role: Role;
    influence: Resource;
  }) {
    const msg: BondingThroughAdversityData = {
      kind: 'bonding-through-adversity',
      influenceVoteData,
    };
    this.send(msg);
  }

  public saveResourcesSelection(savedResources: InvestmentData) {
    const msg: BreakdownOfTrustData = {
      kind: 'breakdown-of-trust',
      savedResources,
    };
    this.send(msg);
  }

public saveHeroOrPariah(heroOrPariah: 'hero' | 'pariah') {
    const msg: VoteHeroOrPariahData = {
      kind: 'vote-hero-or-pariah',
      heroOrPariah,
    };
    this.send(msg);
}

public saveHeroOrPariahRole(vote: Role) {
    const msg: VoteHeroOrPariahRoleData = {
      kind: 'vote-hero-or-pariah-role',
      vote,
    };
    this.send(msg);
}

  //UI COMMANDS
  public investPendingTimeBlocks(investment: any) {
    this.store.commit('SET_PENDING_INVESTMENT_AMOUNT', investment);
  }

  public setModalVisible(data: any) {
    this.store.commit('SET_MODAL_VISIBLE', data);
  }

  public setModalHidden() {
    this.store.commit('SET_MODAL_HIDDEN', null);
  }

  public toggleProfileMenu(currentVisiblility: boolean) {
    this.store.commit('SET_PROFILE_MENU_VISIBILITY', !currentVisiblility);
  }

  public setChatMarsLogView(view: ChatMarsLogView) {
    this.store.commit('SET_CHATMARSLOG_VIEW', view);
  }

  public setHUDLeftView(view: HUDLeftView) {
    this.store.commit('SET_HUDLEFT_VIEW', view);
  }

  public setHUDRightView(view: HUDRightView) {
    this.store.commit('SET_HUDRIGHT_VIEW', view);
  }

  public setTradePlayerName(role: Role) {
    this.store.commit('SET_TRADE_PLAYER_NAME', role);
  }

  public setTradePartnerName(name: string) {
    this.store.commit('SET_TRADE_PARTNER_NAME', name as Role);
  }

  public setTradeGetResources(resources: ResourceAmountData) {
    this.store.commit('SET_GET_RESOURCES', resources);
  }

  public setTradeGiveResources(resources: ResourceAmountData) {
    this.store.commit('SET_SEND_RESOURCES', resources);
  }

  public resetTradeModal() {
    this.store.commit('RESET_TRADE_MODAL', null);
  }

  public discardOption(data: any) {
    this.setModalVisible(data);
  }
}
