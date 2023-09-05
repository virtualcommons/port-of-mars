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

export interface SoloGameClientState {
  status: SoloGameStatus;
  timeRemaining: number;
  systemHealth: number;
  twoCardThreshold?: number;
  threeCardThreshold?: number;
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
  eventCardDeck?: Array<EventCardData>;
  roundEventCards: Array<EventCardData>;
  activeRoundCardIndex: number;
  canInvest: boolean;
  isRoundTransitioning: boolean;
}
