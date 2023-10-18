import { EventCardData } from "./types";

export interface SetHiddenParams {
  kind: "set-hidden-params";
  data: {
    twoEventsThreshold?: number;
    threeEventsThreshold?: number;
    twoEventsThresholdRange?: { min: number; max: number };
    threeEventsThresholdRange?: { min: number; max: number };
    maxRound?: number;
    eventCardDeck: Array<EventCardData>;
  };
}

export type SoloGameResponse = SetHiddenParams;
