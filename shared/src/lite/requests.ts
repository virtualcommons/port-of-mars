import { Role } from "../types";

export interface EventContinue {
  kind: "event-continue";
  data?: any;
}

export interface Invest {
  kind: "invest";
  systemHealthInvestment: number;
}

export interface PlayerReady {
  kind: "player-ready";
  data?: any;
}

export interface Vote {
  kind: "vote";
  deckCardId: number;
  roleVote: Role;
  binaryVote: boolean;
}

export interface SendChatMessage {
  kind: "send-chat-message";
  message: string;
}

export type LiteGameRequest = EventContinue | Invest | PlayerReady | SendChatMessage;
