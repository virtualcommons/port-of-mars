import { InvestmentData, TradeData } from './types';

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

export interface SetPlayerReadinessData {
  kind: 'set-player-readiness';
  value: boolean;
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

//NICK CHANGES
export interface RejectTradeRquestData {
  kind: 'reject-trade-request';
  id: string;
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
  | RejectTradeRquestData;
