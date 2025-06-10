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
  gameType: LiteGameType;
  isNumberOfRoundsKnown: boolean;
  isEventDeckKnown: boolean;
  thresholdInformation: ThresholdInformation;
  isLowResSystemHealth: boolean;
  instructions?: string;
}

export type LiteGameType = "freeplay" | "prolificBaseline" | "prolificVariable";

export type LiteGameStatus = "incomplete" | "victory" | "defeat";

export interface LiteGameParams {
  numPlayers?: number;
  // determines which game type to reset and transition to in the same game room
  // if not defined, then end normally
  nextGameType?: LiteGameType;
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

export interface SoloGameClientState {
  type: LiteGameType;
  status: LiteGameStatus;
  player: {
    resources: number;
    points: number;
  };
  treatmentParams: {
    isNumberOfRoundsKnown: boolean;
    isEventDeckKnown: boolean;
    thresholdInformation: "unknown" | "range" | "known";
    isLowResSystemHealth: boolean;
    instructions?: string;
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

export interface LiteGamePlayerClientState {
  username: string;
  role: Role;
  resources: number;
  points: number;
  pendingInvestment: number | null;
  hasInvested: boolean;
  pointsEarned: number | null;
  isReadyToStart: boolean;
}

export interface LiteGameClientState extends SoloGameClientState {
  players: Map<string, LiteGamePlayerClientState>;
  player: LiteGamePlayerClientState;
  numPlayers: number;
  isWaitingToStart: boolean;
}
