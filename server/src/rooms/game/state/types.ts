import {
  ChatMessageData,
  InvestmentData,
  MarsEventData,
  MarsLogMessageData,
  Phase,
  Resource,
  ResourceAmountData,
  ResourceCostData,
  Role,
  RoundIntroductionData,
  SystemHealthChangesData,
  TradeSetData
} from "@port-of-mars/shared/types";

export interface RoundSummary {
  systemHealth: number;
  timeRemaining: number;
  round: number;
  logs: Array<MarsLogMessageData>;
  messages: Array<ChatMessageData>;
  marsEvents: Array<MarsEventData>;
  marsEventsProcessed: number;
  roundIntroduction: RoundIntroductionData;
  tradeSet: TradeSetData;
  tradingEnabled: boolean;
  heroOrPariah: "" | "hero" | "pariah";
}

export interface GameSerialized extends RoundSummary {
  players: PlayerSetSerialized;
  userRoles: { [username: string]: Role };
  maxRound: number;
  lastTimePolled: number;
  phase: Phase;
  marsEventDeck: MarsEventDeckSerialized;
  winners: Array<Role>;
  heroOrPariah: "" | "hero" | "pariah";
}

export interface MarsEventDeckSerialized {
  deck: Array<MarsEventData>;
  position: number;
}

export interface PlayerSerialized {
  role: Role;
  username: string;
  isBot: boolean;
  isMuted: boolean;
  costs: ResourceCostData;
  specialty: Resource;
  // TODO: rename to accomplishments for consistency but postpone till we're about to have a new tournament
  accomplishment: AccomplishmentSetSerialized;
  ready: boolean;
  timeBlocks: number;
  systemHealthChange: SystemHealthChangesData;
  victoryPoints: number;
  inventory: ResourceAmountData;
  pendingInvestments: InvestmentData;
}

export type PlayerSetSerialized = { [role in Role]: PlayerSerialized };

export interface AccomplishmentSetSerialized {
  role: Role;
  purchased: Array<number>;
  purchasable: Array<number>;
  remaining: Array<number>;
}