import {InvestmentData} from "./types";

export interface SendChatMessageData {
  kind: 'send-chat-message'
  message: string
}

export interface BuyAccomplishmentCardData {
  kind: 'buy-accomplishment-card',
  id: number
}

export interface SetTimeInvestmentData extends InvestmentData {
  kind: 'set-time-investment'
}

export interface SetPlayerReadinessData {
  kind: 'set-player-readiness',
  value: boolean
}

export interface SetNextPhaseData {
  kind: 'set-next-phase'
}

export interface ResetGameData {
  kind: 'reset-game'
}

export type Requests = SendChatMessageData | SetPlayerReadinessData | SetNextPhaseData | ResetGameData | SetTimeInvestmentData