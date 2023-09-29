export interface EventCardData {
  id: number;
  deckCardId?: number;
  expired?: boolean;
  inPlay?: boolean;
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

export interface SoloGameClientState {
  status: SoloGameStatus;
  timeRemaining: number;
  systemHealth: number;
  twoCardThreshold?: number;
  threeCardThreshold?: number;
  twoCardThresholdRange?: { min: number; max: number };
  threeCardThresholdRange?: { min: number; max: number };
  maxRound?: number;
  round: number;
  treatmentParams: {
    isKnownNumberOfRounds: boolean;
    isEventDeckKnown: boolean;
    thresholdInformation: "unknown" | "range" | "known";
  };
  player: {
    resources: number;
    points: number;
  };
  visibleEventCards: Array<EventCardData>;
  activeCardId: number;
  canInvest: boolean;
  isRoundTransitioning: boolean;
}
