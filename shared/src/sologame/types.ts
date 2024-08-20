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
  gameType: SoloGameType;
  isNumberOfRoundsKnown: boolean;
  isEventDeckKnown: boolean;
  thresholdInformation: ThresholdInformation;
  isLowResSystemHealth: boolean;
}

export type SoloGameType = "freeplay" | "prolific_baseline" | "prolific_variable";

export type SoloGameStatus = "incomplete" | "victory" | "defeat";

export interface SoloGameParams {
  maxRound: { min: number; max: number };
  roundTransitionDuration: number;
  twoEventsThreshold: { min: number; max: number };
  threeEventsThreshold: { min: number; max: number };
  systemHealthMax: number;
  systemHealthWear: number;
  startingSystemHealth: number;
  timeRemaining: number;
  eventTimeout: number;
  points: number;
  resources: number;
}

export interface SoloGameClientState {
  status: SoloGameStatus;
  timeRemaining: number;
  systemHealth: number;
  twoEventsThreshold?: number;
  threeEventsThreshold?: number;
  twoEventsThresholdRange?: { min: number; max: number };
  threeEventsThresholdRange?: { min: number; max: number };
  maxRound?: number;
  round: number;
  treatmentParams: {
    isNumberOfRoundsKnown: boolean;
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
