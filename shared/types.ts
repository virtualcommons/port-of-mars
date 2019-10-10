import {Player} from "../server/src/Game";

export interface AccomplishmentData {
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

export interface ResourceAllocationData {
  science: number
  government: number
  legacy: number
  finance: number
  culture: number
}

export interface ResourceCostData {
  science: number
  government: number
  legacy: number
  finance: number
  culture: number
}

export interface PlayerData<A extends AccomplishmentData, R extends ResourceAllocationData, C extends ResourceCostData> {
  accomplishments: Array<A>;
  resources: R;
  costs: C;
  role: string;
}

export enum Stage {
  events,
  trade
}