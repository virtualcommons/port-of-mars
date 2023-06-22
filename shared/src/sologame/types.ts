export interface EventCardData {
  id: number;
  codeName: string;
  displayName: string;
  flavorText: string;
  effectText: string;
  pointsEffect: number;
  resourcesEffect: number;
  systemHealthEffect: number;
}

export type ThresholdInformation = "unknown" | "range" | "known";

export interface TreatmentData {
  isKnownNumberOfRounds: boolean;
  isEventDeckKnown: boolean;
  thresholdInformation: ThresholdInformation;
}

export type SoloGameStatus = "incomplete" | "victory" | "defeat";
