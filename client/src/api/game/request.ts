import { SfxManager } from "@port-of-mars/client/util";
import { Room } from "colyseus.js";
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
  BreakdownOfTrustData,
  ResetBotWarningData,
  VoteHeroOrPariahData,
  VoteHeroOrPariahRoleData
} from "@port-of-mars/shared/game/requests";
import {
  AccomplishmentData,
  InvestmentData,
  TradeData,
  Role,
  Resource,
  ResourceAmountData
} from "@port-of-mars/shared/types";
import { ChatMarsLogView, HUDLeftView, HUDRightView } from "@port-of-mars/shared/game/client/panes";
import { MockRoom } from "@port-of-mars/client/types/tutorial";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { AbstractGameAPI } from "@port-of-mars/client/api/game/types";
import { defaultPendingInvestment } from "@port-of-mars/shared/game/client/state";
import { Sfx } from "@port-of-mars/shared/game/responses";

export class GameRequestAPI implements AbstractGameAPI {
  room!: Room | MockRoom;
  private store!: TStore;
  private sfx!: SfxManager;

  public connect(room: Room | MockRoom, store: TStore) {
    this.room = room;
    this.store = store;
  }

  public send(req: Requests) {
    this.room.send(req.kind, req);
  }

  public resetPendingInvestments() {
    this.store.commit("SET_PENDING_INVESTMENTS", {
      role: this.store.state.role,
      data: defaultPendingInvestment()
    });
  }

  public resetBotWarning() {
    const msg: ResetBotWarningData = { kind: "reset-bot-warning" };
    this.send(msg);
  }

  public sendChatMessage(message: string) {
    const msg: SendChatMessageData = {
      message,
      kind: "send-chat-message"
    };
    this.send(msg);
  }

  public setNextPhase() {
    const msg: SetNextPhaseData = { kind: "set-next-phase" };
    this.send(msg);
  }

  public setSfxManager(sfxManager: SfxManager) {
    this.sfx = sfxManager;
  }

  public resetGame() {
    const msg: ResetGameData = { kind: "reset-game" };
    this.send(msg);
  }

  public investTimeBlocks(investment: InvestmentData) {
    const msg: SetTimeInvestmentData = {
      ...investment,
      kind: "set-time-investment"
    };
    this.send(msg);
  }

  public purchaseAccomplishment(accomplishment: AccomplishmentData) {
    const msg: PurchaseAccomplishmentCardData = {
      kind: "purchase-accomplishment-card",
      id: accomplishment.id
    };
    this.send(msg);
    this.sfx.play({ kind: "set-sfx", sfx: Sfx.PURCHASE_ACCOMPLISHMENT });
  }

  public discardAccomplishment(id: number) {
    const msg: DiscardAccomplishmentCardData = {
      kind: "discard-accomplishment-card",
      id
    };
    this.send(msg);
    this.sfx.play({ kind: "set-sfx", sfx: Sfx.DISCARD_ACCOMPLISHMENT });
  }

  public stageDiscardOfPurchasedAccomplishment(id: number) {
    const msg: StageDiscardOfPurchasedAccomplishmentCardData = {
      kind: "stage-discard-of-purchased-accomplishment-card",
      id
    };
    this.send(msg);
  }

  public sendTradeRequest(trade: SendTradeRequestData["trade"]) {
    const msg: SendTradeRequestData = {
      kind: "send-trade-request",
      trade
    };
    this.send(msg);
    this.sfx.play({ kind: "set-sfx", sfx: Sfx.SEND_TRADE_REQUEST });
  }

  public acceptTradeRequest(id: string) {
    const msg: AcceptTradeRequestData = {
      kind: "accept-trade-request",
      id
    };
    this.send(msg);
  }

  public rejectTradeRequest(id: string) {
    const msg: RejectTradeRequestData = {
      kind: "reject-trade-request",
      id
    };
    this.send(msg);
  }

  public cancelTradeRequest(id: string) {
    const msg: CancelTradeRequestData = {
      kind: "cancel-trade-request",
      id
    };
    this.send(msg);
  }

  public setPlayerReadiness(value: boolean) {
    const msg: SetPlayerReadinessData = {
      kind: "set-player-readiness",
      value
    };
    this.send(msg);
    if (value) {
      this.sfx.play({ kind: "set-sfx", sfx: Sfx.READY_TO_ADVANCE });
    } else {
      this.sfx.play({ kind: "set-sfx", sfx: Sfx.CANCEL_READY_TO_ADVANCE });
    }
  }

  public savePersonalGainVote(vote: boolean) {
    const msg: PersonalGainVotesData = { kind: "personal-gain", vote };
    this.send(msg);
  }

  public voteForPhilanthropist(vote: Role) {
    const msg: VoteForPhilanthropistData = {
      kind: "vote-for-philanthropist",
      vote
    };
    this.send(msg);
  }

  public saveBondingThroughAdversitySelection(influenceVoteData: {
    role: Role;
    influence: Resource;
  }) {
    const msg: BondingThroughAdversityData = {
      kind: "bonding-through-adversity",
      influenceVoteData
    };
    this.send(msg);
  }

  public saveBreakdownOfTrust(savedResources: InvestmentData) {
    const msg: BreakdownOfTrustData = {
      kind: "breakdown-of-trust",
      savedResources
    };
    this.send(msg);
  }

  public saveHeroOrPariah(heroOrPariah: "hero" | "pariah") {
    const msg: VoteHeroOrPariahData = {
      kind: "vote-hero-or-pariah",
      heroOrPariah
    };
    this.send(msg);
  }

  public saveHeroOrPariahRole(vote: Role) {
    const msg: VoteHeroOrPariahRoleData = {
      kind: "vote-hero-or-pariah-role",
      vote
    };
    this.send(msg);
  }

  //UI COMMANDS
  public investPendingTimeBlocks(data: { investment: any; units: number; role: Role }) {
    this.store.commit("SET_PENDING_INVESTMENT_AMOUNT", data);
    switch (data.investment) {
      case "science":
        this.sfx.play({ kind: "set-sfx", sfx: Sfx.ADD_SCIENCE });
        break;
      case "culture":
        this.sfx.play({ kind: "set-sfx", sfx: Sfx.ADD_CULTURE });
        break;
      case "finance":
        this.sfx.play({ kind: "set-sfx", sfx: Sfx.ADD_FINANCE });
        break;
      case "government":
        this.sfx.play({ kind: "set-sfx", sfx: Sfx.ADD_GOVERNMENT });
        break;
      case "legacy":
        this.sfx.play({ kind: "set-sfx", sfx: Sfx.ADD_LEGACY });
        break;
      default:
        this.sfx.play({ kind: "set-sfx", sfx: Sfx.ADD_SYSTEM_HEALTH });
    }
  }

  public setModalVisible(data: any) {
    this.store.commit("SET_MODAL_VISIBLE", data);
  }

  public setModalHidden() {
    this.store.commit("SET_MODAL_HIDDEN", null);
  }

  public toggleProfileMenu(currentVisiblility: boolean) {
    this.store.commit("SET_PROFILE_MENU_VISIBILITY", !currentVisiblility);
  }

  // FIXME: deprecate
  public setChatMarsLogView(view: ChatMarsLogView) {
    this.store.commit("SET_CHATMARSLOG_VIEW", view);
  }

  public setHUDLeftView(view: HUDLeftView) {
    this.store.commit("SET_HUDLEFT_VIEW", view);
    switch (view) {
      case HUDLeftView.OtherPlayers:
        this.sfx.play({ kind: "set-sfx", sfx: Sfx.TOGGLE_OTHER_PLAYERS });
        break;
      case HUDLeftView.Accomplishments:
        this.sfx.play({ kind: "set-sfx", sfx: Sfx.TOGGLE_ACCOMPLISHMENTS });
        break;
      case HUDLeftView.Inventory:
        this.sfx.play({ kind: "set-sfx", sfx: Sfx.TOGGLE_INVENTORY });
        break;
    }
  }

  public setHUDRightView(view: HUDRightView) {
    this.store.commit("SET_HUDRIGHT_VIEW", view);
    this.sfx.play({ kind: "set-sfx", sfx: Sfx.CLICK });
  }

  public setTradePlayerName(role: Role) {
    this.store.commit("SET_TRADE_PLAYER_NAME", role);
  }

  public setTradePartnerName(name: string) {
    this.store.commit("SET_TRADE_PARTNER_NAME", name as Role);
    this.sfx.play({ kind: "set-sfx", sfx: Sfx.CLICK });
  }

  public setTradeGetResources(resources: ResourceAmountData) {
    this.store.commit("SET_GET_RESOURCES", resources);
  }

  public setTradeGiveResources(resources: ResourceAmountData) {
    this.store.commit("SET_SEND_RESOURCES", resources);
  }

  public resetTradeModal() {
    this.store.commit("RESET_TRADE_MODAL", null);
  }
}
