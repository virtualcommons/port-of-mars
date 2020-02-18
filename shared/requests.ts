import { InvestmentData, TradeData, Role } from './types';

export interface SendChatMessageData {
  kind: 'send-chat-message';
  message: string;
}

export interface BuyAccomplishmentCardData {
  kind: 'buy-accomplishment-card';
  id: number;
}

export interface DiscardAccomplishmentCardData {
  kind: 'discard-accomplishment-card';
  id: number;
}

export interface SetTimeInvestmentData extends InvestmentData {
  kind: 'set-time-investment';
}

export interface SetNextPhaseData {
  kind: 'set-next-phase';
}

export interface ResetGameData {
  kind: 'reset-game';
}

export interface SendTradeRequestData {
  kind: 'send-trade-request';
  trade: TradeData;
}

export interface AcceptTradeRequestData {
  kind: 'accept-trade-request';
  id: string;
}

export interface RejectTradeRequestData {
  kind: 'reject-trade-request';
  id: string;
}

export interface SetPlayerReadinessData {
  kind: 'set-player-readiness';
  value: boolean;
}

export interface PersonalGainVotesData {
  kind: 'personal-gain';
  value: { role: Role; vote: boolean };
}

export interface VoteForPhilanthropistData {
  kind: 'vote-for-philanthropist';
  vote: Role;
}

export interface OutOfCommissionCuratorData {
  kind: 'out-of-commission-curator';
  value: Role;
}

export interface OutOfCommissionCuratorData {
  kind: 'out-of-commission-curator';
  value: Role;
}

export interface OutOfCommissionPoliticianData {
  kind: 'out-of-commission-politician';
  value: Role;
}

export interface OutOfCommissionResearcherData {
  kind: 'out-of-commission-researcher';
  value: Role;
}

export interface OutOfCommissionPioneerData {
  kind: 'out-of-commission-pioneer';
  value: Role;
}

export type Requests =
  | SendChatMessageData
  | SetPlayerReadinessData
  | SetNextPhaseData
  | ResetGameData
  | SetTimeInvestmentData
  | BuyAccomplishmentCardData
  | DiscardAccomplishmentCardData
  | SendTradeRequestData
  | AcceptTradeRequestData
  | RejectTradeRequestData
  | PersonalGainVotesData
  | VoteForPhilanthropistData
  | OutOfCommissionCuratorData
  | OutOfCommissionPoliticianData
  | OutOfCommissionResearcherData
  | OutOfCommissionPioneerData;
