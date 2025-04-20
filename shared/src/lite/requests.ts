export interface EventContinue {
  kind: "event-continue";
  data?: any;
}

export interface Invest {
  kind: "invest";
  systemHealthInvestment: number;
}

export type MultiplayerGameRequest = Invest;
export type SoloGameRequest = EventContinue | Invest;
