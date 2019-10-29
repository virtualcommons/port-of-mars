import {Player} from "../server/src/Game";

export interface AccomplishmentRawData {
  id: number
  role: 'Researcher' | 'Curator' | 'Pioneer' | 'Entrepreneur' | 'Politician'
  label: string
  flavor_text: string
  science: number
  government: number
  legacy: number
  finance: number
  culture: number
  upkeep: number
  victory_points: number
  effect: string
}

export interface ResourceAmountData {
  science: number
  government: number
  legacy: number
  finance: number
  culture: number
  upkeep: number
}

export interface AccomplishmentData {
  id: number
  role: 'Researcher' | 'Curator' | 'Pioneer' | 'Entrepreneur' | 'Politician'
  label: string
  flavor_text: string
  costs: {
    culture: number
    finance: number
    government: number
    legacy: number
    science: number
    upkeep: number
  }
  victory_points: number
  effect: string
}

export interface PlayerData<A extends AccomplishmentData, RA extends ResourceAmountData, RC extends ResourceAmountData> {
  accomplishments: Array<A>;
  resources: RA;
  costs: RC;
  role: string;
}

export enum Stage {
  events,
  trade
}