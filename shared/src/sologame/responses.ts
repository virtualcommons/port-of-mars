import { EventCardData } from "./types";

export interface SetHiddenParams {
  kind: "set-hidden-params";
  data: {
    twoCardThreshold?: number;
    threeCardThreshold?: number;
    twoCardThresholdRange?: { min: number; max: number };
    threeCardThresholdRange?: { min: number; max: number };
    maxRound?: number;
    eventCardDeck: Array<EventCardData>;
  };
}

export type SoloGameResponse = SetHiddenParams;
