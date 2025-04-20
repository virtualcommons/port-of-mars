import { Role } from "../types";

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

export type SoloGameType = "freeplay" | "prolificBaseline" | "prolificVariable";

export type MultiplayerGameType = "freeplay" | "prolific";

export type LiteGameStatus = "incomplete" | "victory" | "defeat";

export interface LiteGameParams {
  maxRound: { min: number; max: number };
  roundTransitionDuration: number;
  twoEventsThreshold: { min: number; max: number };
  threeEventsThreshold: { min: number; max: number };
  twoEventsThresholdDisplayRange?: { min: number; max: number };
  threeEventsThresholdDisplayRange?: { min: number; max: number };
  systemHealthMax: number;
  systemHealthWear: number;
  startingSystemHealth: number;
  timeRemaining: number;
  eventTimeout: number;
  points: number;
  resources: number;
  availableRoles?: Array<Role>;
}

export interface BaseLiteGameClientState {
  type: string;
  status: LiteGameStatus;
  player: {
    resources: number;
    points: number;
  };
  timeRemaining: number;
  systemHealth: number;
  twoEventsThreshold?: number;
  threeEventsThreshold?: number;
  twoEventsThresholdRange?: { min: number; max: number };
  threeEventsThresholdRange?: { min: number; max: number };
  maxRound?: number;
  round: number;
  visibleEventCards: Array<EventCardData>;
  activeCardId: number;
  canInvest: boolean;
  isRoundTransitioning: boolean;
}

export interface SoloGameClientState extends BaseLiteGameClientState {
  type: SoloGameType;
  treatmentParams: {
    isNumberOfRoundsKnown: boolean;
    isEventDeckKnown: boolean;
    thresholdInformation: "unknown" | "range" | "known";
    isLowResSystemHealth: boolean;
  };
}

export interface MultiplayerLiteGamePlayer {
  username: string;
  role: Role;
  resources: number;
  points: number;
  pendingInvestment: number | null;
  pointsEarned: number | null;
  isReady: boolean;
}

export interface MultiplayerLiteGameClientState extends BaseLiteGameClientState {
  type: MultiplayerGameType;
  players: Map<string, MultiplayerLiteGamePlayer>;
  numPlayers: number;
  maxRound: number;
  twoEventsThreshold: number;
  threeEventsThreshold: number;
}
