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

export interface AccomplishmentData {
  id: number
  role: Role
  label: string
  flavor_text: string
  costs: {
    culture: number
    finance: number
    government: number
    legacy: number
    science: number
    upkeep: number
  };
  victory_points: number
  effect: string
}

export interface PlayerData<A extends AccomplishmentData, RA extends ResourceAmountData, RC extends ResourceAmountData> {
  accomplishments: Array<A>
  resources: RA
  costs: RC
  role: string
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