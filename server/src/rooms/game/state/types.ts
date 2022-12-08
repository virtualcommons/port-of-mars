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

export interface GameSerialized {
  players: PlayerSetSerialized;
  userRoles: { [username: string]: Role };
  maxRound: number;
  lastTimePolled: number;
  timeRemaining: number;
  botWarning: boolean;
  round: number;
  phase: Phase;
  systemHealth: number;
  logs: Array<MarsLogMessageData>;
  messages: Array<ChatMessageData>;
  marsEvents: Array<MarsEventData>;
  marsEventsProcessed: number;
  marsEventDeck: MarsEventDeckSerialized;
  roundIntroduction: RoundIntroductionData;
  tradeSet: TradeSetData;
  winners: Array<Role>;
  tradingEnabled: boolean;
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