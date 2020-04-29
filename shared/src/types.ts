export const RESEARCHER: 'Researcher' = 'Researcher';
export const CURATOR: 'Curator' = 'Curator';
export const PIONEER: 'Pioneer' = 'Pioneer';
export const ENTREPRENEUR: 'Entrepreneur' = 'Entrepreneur';
export const POLITICIAN: 'Politician' = 'Politician';
export const SERVER: 'Server' = 'Server';
export const ROLES: Array<Role> = [
  CURATOR,
  ENTREPRENEUR,
  PIONEER,
  POLITICIAN,
  RESEARCHER
];
export type Role =
  | 'Researcher'
  | 'Curator'
  | 'Pioneer'
  | 'Entrepreneur'
  | 'Politician';
export type ServerRole = 'Server';

export interface ChatMessageData {
  message: string;
  role: string;
  dateCreated: number;
  round: number;
}

export interface MarsLogData {
  category: string;
  message: string;
}

export interface ResourceAmountData {
  science: number;
  government: number;
  legacy: number;
  finance: number;
  culture: number;
}

export interface InvestmentData extends ResourceAmountData {
  upkeep: number;
}

export type ResourceCostData = InvestmentData;

export type Resource = keyof ResourceAmountData;
export type Investment = keyof InvestmentData;
export const INVESTMENTS: Array<Investment> = [
  'culture',
  'finance',
  'government',
  'legacy',
  'science',
  'upkeep'
];
export const RESOURCES: Array<Resource> = [
  'culture',
  'finance',
  'government',
  'legacy',
  'science'
];

export enum Phase {
  events,
  invest,
  trade,
  purchase,
  discard,
  victory,
  defeat
}

export const PHASE_LABELS: { [k in Phase]: string } = {
  [Phase.events]: 'Events',
  [Phase.invest]: 'Investment',
  [Phase.trade]: 'Trade',
  [Phase.purchase]: 'Purchase',
  [Phase.discard]: 'Discard',
  [Phase.victory]: 'Victory!',
  [Phase.defeat]: 'Defeat!'
};

export type EventClientView =
// EventNoChange (TODO)
  | 'NO_CHANGE'
  | 'AUDIT'
  | 'DISABLE_CHAT'
  // EventVote
  | 'VOTE_YES_NO'
  | 'VOTE_FOR_PLAYER_SINGLE'
  | 'VOTE_FOR_PLAYER_HERO_PARIAH'
  // EventInfluences
  | 'INFLUENCES_SELECT'
  | 'INFLUENCES_DRAW'
  // EventAccomplishments
  | 'ACCOMPLISHMENT_SELECT_PURCHASED';

export interface MarsEventData {
  id: string;
  name: string;
  effect: string;
  flavorText: string;
  clientViewHandler: EventClientView;
  duration: number;
  timeDuration?: number;
}

export enum MarsLogCategory {
  systemHealth = "SYSTEM HEALTH",
  event = "EVENT",
  trade = "TRADE",
  accomplishment = "ACCOMPLISHMENT",
  purchaseAccomplishment = "PURCHASE ACCOMPLISHMENT",
  sentTrade = "SENT TRADE",
  invalidTrade = "INVALID TRADE",
  acceptTrade = "ACCEPT TRADE",
  rejectTrade = "REJECT TRADE",
  cancelTrade = "CANCELLED TRADE"
}

export interface MarsLogData {
  category: string;
  message: string;
}

export interface MarsLogMessageData {
  performedBy: Role | ServerRole;
  category: string;
  content: string;
  round: number;
  timestamp: number;
}

export interface AccomplishmentData {
  id: number;
  role: Role;
  label: string;
  flavorText: string;
  science: number;
  government: number;
  legacy: number;
  finance: number;
  culture: number;
  upkeep: number;
  victoryPoints: number;
  effect: string;
}

export interface AccomplishmentSetData {
  purchased: Array<AccomplishmentData>;
  purchasable: Array<AccomplishmentData>;
}

export interface TradeAmountData {
  role: Role;
  resourceAmount: ResourceAmountData;
}


export type TradeStatus = 'Active' | 'Accepted' | 'Rejected' | 'Cancelled';

export interface TradeData {
  from: TradeAmountData;
  to: TradeAmountData;
  status: TradeStatus;
}

export type NullPartner = '';

export interface TradeAmountDataWithNull<R> {
  role: R;
  resourceAmount: ResourceAmountData;
}

export interface TradeDataWithNull<R=Role|NullPartner>{
  from:TradeAmountDataWithNull<R>;
  to: TradeAmountDataWithNull<R>;
}

export type TradeSetData = { [uuid: string]: TradeData };

export interface PlayerData {
  role: Role;
  costs: ResourceCostData;
  specialty: Resource;
  accomplishments: AccomplishmentSetData;
  ready: boolean;
  timeBlocks: number;
  contributedUpkeep: number;
  victoryPoints: number;
  inventory: ResourceAmountData;
  pendingInvestments: ResourceAmountData;
}

export type PlayerSetData = { [role in Role]: PlayerData };

export interface GameData {
  players: PlayerSetData;
  timeRemaining: number;
  round: number;
  phase: Phase;
  upkeep: number;
  messages: Array<ChatMessageData>;
  marsEvents: Array<MarsEventData>;
  logs: Array<MarsLogMessageData>;
  marsEventsProcessed: number;
  tradeSet: TradeSetData;
  winners: Array<Role>;
}

export interface QuizData {
  id: number;
  question: string;
  correct: number;
  options: Array<String>;
}

export interface QuizQuestionData {
  id: number;
  question: string;
  options: Array<String>;
}

export interface ActionItem {
  done: boolean
  description: string
  link: { kind: 'internal', data: string } | { kind: 'external', data: string }
}

export interface GameMeta {
  time: number // unix timestamp
  round: number
  tournamentName: string
}

export interface Stats {
  games: Array<GameMeta & {points: number, winner: Role}>
}

export interface DashboardData {
  actionItems: Array<ActionItem>
  upcomingGames: Array<GameMeta>
  stats: Stats
}

export interface ServerErrorMessage {
  message: string
}

export type RoomId = string;