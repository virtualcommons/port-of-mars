import { Role } from "../types";

export interface EventContinue {
  kind: "event-continue";
  data?: any;
}

export interface Invest {
  kind: "invest";
  systemHealthInvestment: number;
}

export interface Vote {
  kind: "vote";
  deckCardId: number;
  roleVote: Role;
  binaryVote: boolean;
}

export type LiteGameRequest = EventContinue | Invest;
