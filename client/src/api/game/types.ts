import { Room } from "colyseus.js";
import { MockRoom } from "@port-of-mars/client/types/tutorial";
import { TStore } from "@port-of-mars/client/plugins/tstore";
import { SfxManager } from "@port-of-mars/client/util";
import { SendTradeRequestData } from "@port-of-mars/shared/game";
import {
  AccomplishmentData,
  InvestmentData,
  Resource,
  ResourceAmountData,
  Role
} from "@port-of-mars/shared/types";
import { ChatMarsLogView, HUDLeftView, HUDRightView } from "@port-of-mars/shared/game/client/panes";

export interface AbstractGameAPI {
  connect(room: Room | MockRoom, store: TStore): void;

  resetBotWarning(): void;

  setNextPhase(): void;

  resetGame(): void;

  investTimeBlocks(investment: InvestmentData): void;

  purchaseAccomplishment(accomplishment: AccomplishmentData): void;

  discardAccomplishment(id: number): void;

  stageDiscardOfPurchasedAccomplishment(id: number): void;

  sendTradeRequest(trade: SendTradeRequestData["trade"]): void;

  acceptTradeRequest(id: string): void;

  rejectTradeRequest(id: string): void;

  cancelTradeRequest(id: string): void;

  setSfxManager(sfx: SfxManager): void;

  setPlayerReadiness(value: boolean): void;

  savePersonalGainVote(vote: boolean): void;

  voteForPhilanthropist(vote: Role): void;

  saveBondingThroughAdversitySelection(influenceVoteData: {
    role: Role;
    influence: Resource;
  }): void;

  saveBreakdownOfTrust(savedResources: InvestmentData): void;

  resetPendingInvestments(): void;
  investPendingTimeBlocks(investment: any): void;

  toggleProfileMenu(currentVisiblility: boolean): void;

  setChatMarsLogView(view: ChatMarsLogView): void;

  setHUDLeftView(view: HUDLeftView): void;

  setHUDRightView(view: HUDRightView): void;

  setTradePlayerName(role: Role): void;

  setTradePartnerName(name: string): void;

  setTradeGetResources(resources: ResourceAmountData): void;

  setTradeGiveResources(resources: ResourceAmountData): void;

  resetTradeModal(): void;
}
