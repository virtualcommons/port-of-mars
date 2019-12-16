export const RESEARCHER: 'Researcher' = 'Researcher';
export const CURATOR: 'Curator' = 'Curator';
export const PIONEER: 'Pioneer' = 'Pioneer';
export const ENTREPRENEUR: 'Entrepreneur' = 'Entrepreneur';
export const POLITICIAN: 'Politician' = 'Politician';
export const ROLES: Array<Role> = [CURATOR, ENTREPRENEUR, PIONEER, POLITICIAN, RESEARCHER];
export type Role = 'Researcher' | 'Curator' | 'Pioneer' | 'Entrepreneur' | 'Politician';

export interface ChatMessageData {
  message: string
  role: string
  dateCreated: number
  round: number
}

export interface ResourceAmountData {
  science: number
  government: number
  legacy: number
  finance: number
  culture: number
}

export interface InvestmentData extends ResourceAmountData {
  upkeep: number
}

export type ResourceCostData = InvestmentData

export type Resource = keyof ResourceAmountData
export type Investment = keyof InvestmentData;
export const INVESTMENTS: Array<Investment> = ['culture', 'finance', 'government', 'legacy', "science", 'upkeep'];
export const RESOURCES: Array<Resource> = ['culture', 'finance', 'government', 'legacy', "science"];

export enum Phase {
  pregame,
  events,
  invest,
  trade,
  purchase,
  discard,
  victory,
  defeat
}

export const PHASE_LABELS: { [k in Phase]: string } = {
  [Phase.pregame]: 'Pre-Game',
  [Phase.events]: 'Events',
  [Phase.invest]: 'Investment',
  [Phase.trade]: 'Trade',
  [Phase.purchase]: 'Purchase',
  [Phase.discard]: 'Discard',
  [Phase.victory]: 'Victory!',
  [Phase.defeat]: 'Defeat!'
};

export enum EventServerActions {
  // EVENT
  ADD_EVENT_TWO = 'ADD_EVENT_TWO',

  // VOTING
  START_POLL_YES_NO = 'START_POLL_YES_NO',
  START_POLL_SINGLE = 'START_POLL_SINGLE',
  START_POLL_HERO_PARIAH = 'START_POLL_HERO_PARIAH',
  ACTIONS_POLL_YES_NO = 'ACTIONS_POLL_YES_NO',
  ACTIONS_POLL_SINGLE = 'ACTIONS_POLL_SINGLE',
  ACTIONS_POLL_HERO_PARIAH = 'ACTIONS_POLL_HERO_PARIAH',

  // PHASE
  SKIP_PHASE_TRADING = 'SKIP_PHASE_TRADING',

  // UPKEEP
  GLOBAL_MODIFY_UPKEEP_MINUS_FIVE = 'GLOBAL_MODIFY_UPKEEP_MINUS_FIVE',
  GLOBAL_MODIFY_UPKEEP_MINUS_SEVEN = 'GLOBAL_MODIFY_UPKEEP_MINUS_SEVEN',
  GLOBAL_MODIFY_UPKEEP_MINUS_TEN = 'GLOBAL_MODIFY_UPKEEP_MINUS_TEN',
  GLOBAL_MODIFY_UPKEEP_MINUS_TWENTY = 'GLOBAL_MODIFY_UPKEEP_MINUS_TWENTY',

  // INVESTMENTS
  PLAYER_MODIFY_SPECIALTY_COST_BLOCKED = 'PLAYER_MODIFY_SPECIALTY_COST_BLOCKED',
  PLAYER_MODIFY_DISABLED_COST_THREE = 'PLAYER_MODIFY_DISABLED_COST_THREE',
  PLAYER_MODIFY_TIMEBLOCKS_MINUS_FIVE = 'PLAYER_MODIFY_TIMEBLOCKS_MINUS_FIVE',

  // TIMEBLOCKS
  PLAYER_MODIFY_TIMEBLOCKS_EQUALS_THREE = 'PLAYER_MODIFY_TIMEBLOCKS_EQUALS_THREE'

}

export enum EventClientView {
  NO_CHANGE = 'NO_CHANGE',
  VOTE_YES_NO = 'VOTE_YES_NO',
  SELECT_INFLUENCES = 'SELECT_INFLUENCES',
  DRAW_INFLUENCES = 'DRAW_INFLUENCES',
  VOTE_FOR_PLAYER_SINGLE = 'VOTE_FOR_PLAYER_SINGLE',
  VOTE_FOR_PLAYER_HERO_PARIAH = 'VOTE_FOR_PLAYER_HERO_PARIAH',
  AUDIT = 'AUDIT',
  SELECT_PURCHASED_ACCOMPLISHMENT = 'SELECT_PURCHASED_ACCOMPLISHMENT',
  DISABLE_CHAT = 'DISABLE_CHAT',
}

export enum EventClientActions {
  // CARDS
  PLAYER_SELECT_INFLUENCE_CARD_TWO = 'PLAYER_SELECT_INFLUENCE_CARD_TWO',
  PLAYER_DISCARD_INFLUENCE_CARD_ALL = 'PLAYER_DISCARD_INFLUENCE_CARD_ALL',
  PLAYER_DRAW_INFLUENCE_CARD_ONE = 'PLAYER_DRAW_INFLUENCE_CARD_ONE',
  PLAYER_DRAW_ACCOMPLISHMENT_CARD_ONE = 'PLAYER_DRAW_ACCOMPLISHMENT_CARD_ONE',
  PLAYER_DISCARD_ACCOMPLISHMENT_CARD_ALL = 'PLAYER_DISCARD_ACCOMPLISHMENT_CARD_ALL',
  PLAYER_DISCARD_PURCHASED_ACCOMPLISHMENT_CARD_ONE = 'PLAYER_DISCARD_PURCHASED_ACCOMPLISHMENT_CARD_ONE',

  // VOTING
  PLAYER_COLLECT_VOTE = 'PLAYER_COLLECT_VOTE',
  PLAYER_SEND_VOTE = 'PLAYER_SEND_VOTE',

  // DOCK
  ADD_TO_EVENT_DOCK = 'ADD_TO_EVENT_DOCK',

  // SERVER
  UPDATE_SERVER = 'UPDATE_SERVER'
}

export interface MarsEventEffects {
  server: {
    actions: Array<string>
  }
  client: {
    view: Array<string>
    actions: Array<string>
  }
}

export interface MarsEventDataTwo {
  id: number
  name: string
  effectText: string
  flavorText: string
  effects: MarsEventEffects
  duration: number
}

export interface MarsEventData {
  id: number
  name: string
  effect: string
  flavorText: string
}

export interface MarsLogMessageData {
  performedBy: Role
  category: string
  content: string
  timestamp: number
}

export interface AccomplishmentData {
  id: number
  role: Role
  label: string
  flavorText: string
  science: number
  government: number
  legacy: number
  finance: number
  culture: number
  upkeep: number
  victoryPoints: number
  effect: string
}

export interface AccomplishmentSetData {
  bought: Array<AccomplishmentData>
  purchasable: Array<AccomplishmentData>
}

export interface TradeAmountData {
  role: Role,
  resourceAmount: ResourceAmountData
}

export interface TradeData {
  from: TradeAmountData
  to: TradeAmountData
}

export type TradeSetData = { [uuid: string]: TradeData }

export interface PlayerData {
  role: Role
  costs: ResourceCostData
  accomplishment: AccomplishmentSetData
  ready: boolean
  timeBlocks: number
  contributedUpkeep: number
  victoryPoints: number
  inventory: ResourceAmountData
  pendingInvestments: ResourceAmountData
}

export type PlayerSetData = { [role in Role]: PlayerData }

export interface GameData {
  players: PlayerSetData
  timeRemaining: number
  round: number
  phase: Phase
  upkeep: number
  messages: Array<ChatMessageData>
  marsEvents: Array<MarsEventData>
  logs: Array<MarsLogMessageData>
  marsEventsProcessed: number
  tradeSet: TradeSetData
}

export interface QuizData {
  id: number
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct: number
}
