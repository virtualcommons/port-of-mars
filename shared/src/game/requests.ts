import { InvestmentData, TradeData, Role, Resource } from "../types";

export interface SendChatMessageData {
  kind: "send-chat-message";
  message: string;
}

export interface ResetBotWarningData {
  kind: "reset-bot-warning";
}

export interface PurchaseAccomplishmentCardData {
  kind: "purchase-accomplishment-card";
  id: number;
}

export interface DiscardAccomplishmentCardData {
  kind: "discard-accomplishment-card";
  id: number;
}

export interface SetTimeInvestmentData extends InvestmentData {
  kind: "set-time-investment";
}

export interface SetNextPhaseData {
  kind: "set-next-phase";
}

export interface ResetGameData {
  kind: "reset-game";
}

export interface SendTradeRequestData {
  kind: "send-trade-request";
  trade: Omit<TradeData, "id">;
}

export interface AcceptTradeRequestData {
  kind: "accept-trade-request";
  id: string;
}

export interface RejectTradeRequestData {
  kind: "reject-trade-request";
  id: string;
}

export interface CancelTradeRequestData {
  kind: "cancel-trade-request";
  id: string;
}

export interface SetPlayerReadinessData {
  kind: "set-player-readiness";
  value: boolean;
}

export interface PersonalGainVotesData {
  kind: "personal-gain";
  vote: boolean;
}

export interface VoteForPhilanthropistData {
  kind: "vote-for-philanthropist";
  vote: Role;
}

export interface OutOfCommissionCuratorData {
  kind: "out-of-commission-curator";
  value: Role;
}

export interface OutOfCommissionCuratorData {
  kind: "out-of-commission-curator";
  value: Role;
}

export interface OutOfCommissionPoliticianData {
  kind: "out-of-commission-politician";
  value: Role;
}

export interface OutOfCommissionResearcherData {
  kind: "out-of-commission-researcher";
  value: Role;
}

export interface OutOfCommissionPioneerData {
  kind: "out-of-commission-pioneer";
  value: Role;
}

export interface OutOfCommissionEntrepreneurData {
  kind: "out-of-commission-entrepreneur";
  value: Role;
}

export interface BondingThroughAdversityData {
  kind: "bonding-through-adversity";
  influenceVoteData: { role: Role; influence: Resource };
}

export interface BreakdownOfTrustData {
  kind: "breakdown-of-trust";
  savedResources: InvestmentData;
}

export interface StageDiscardOfPurchasedAccomplishmentCardData {
  kind: "stage-discard-of-purchased-accomplishment-card";
  id: number;
}

export interface VoteHeroOrPariahData {
  kind: "vote-hero-or-pariah";
  heroOrPariah: "hero" | "pariah";
}

export interface VoteHeroOrPariahRoleData {
  kind: "vote-hero-or-pariah-role";
  vote: Role;
}

export type Requests =
  | SendChatMessageData
  | ResetBotWarningData
  | SetPlayerReadinessData
  | SetNextPhaseData
  | ResetGameData
  | SetTimeInvestmentData
  | PurchaseAccomplishmentCardData
  | DiscardAccomplishmentCardData
  | StageDiscardOfPurchasedAccomplishmentCardData
  | SendTradeRequestData
  | AcceptTradeRequestData
  | RejectTradeRequestData
  | CancelTradeRequestData
  | PersonalGainVotesData
  | VoteForPhilanthropistData
  | OutOfCommissionCuratorData
  | OutOfCommissionPoliticianData
  | OutOfCommissionResearcherData
  | OutOfCommissionPioneerData
  | OutOfCommissionEntrepreneurData
  | BondingThroughAdversityData
  | BreakdownOfTrustData
  | VoteHeroOrPariahData
  | VoteHeroOrPariahRoleData;
