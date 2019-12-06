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

export interface ResourceCostData {
  science: number
  government: number
  legacy: number
  finance: number
  culture: number
  upkeep: number
}

export interface InvestmentData {
  science: number
  government: number
  legacy: number
  finance: number
  culture: number
  upkeep: number
}

export interface ResourceAmountData {
  science: number
  government: number
  legacy: number
  finance: number
  culture: number
}

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

export interface MarsEventData {
  id: number
  name: string
  effect: string
  flavorText: string
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

export interface PlayerData {
  role: Role
  costs: ResourceCostData
  accomplishment: AccomplishmentSetData
  ready: boolean
  timeBlocks: number
  contributedUpkeep: number
  victoryPoints: number
  inventory: ResourceAmountData
}

export type PlayerSetData = { [role in Role]: PlayerData }

export interface GameData {
  players: PlayerSetData
  maxRound: number
  timeRemaining: number
  round: number
  phase: Phase
  upkeep: number
  messages: Array<ChatMessageData>
  marsEvents: Array<MarsEventData>
  marsEventsProcessed: number
}