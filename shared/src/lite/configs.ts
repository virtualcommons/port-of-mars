import { Role } from "@port-of-mars/shared/types";
import { LiteGameType, ThresholdInformation } from "@port-of-mars/shared/lite/types";

export interface LiteGameConfig {
  type: LiteGameType;
  numPlayers: number;
  availableRoles?: Array<Role>;
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
  treatments: Array<TreatmentConfig>;
  eventCards: Array<MarsEventCardConfig>;
}

export interface TreatmentConfig {
  isNumberOfRoundsKnown: boolean;
  isEventDeckKnown: boolean;
  thresholdInformation: ThresholdInformation;
  isLowResSystemHealth: boolean;
  instructions?: string;
}

export interface MarsEventCardConfig {
  codeName: string;
  displayName: string;
  flavorText: string;
  effect: string;
  drawMin: number;
  drawMax: number;
  rollMin: number;
  rollMax: number;
  systemHealthMultiplier: number;
  pointsMultiplier: number;
  resourcesMultiplier: number;
}

export const LITE_CONFIGS: Record<LiteGameType, LiteGameConfig> = {
  freeplay: {
    type: "freeplay",
    numPlayers: 1,
    availableRoles: ["Curator"],
    maxRound: { min: 6, max: 14 },
    roundTransitionDuration: 3,
    twoEventsThreshold: { min: 12, max: 20 },
    threeEventsThreshold: { min: 5, max: 15 },
    timeRemaining: 30,
    eventTimeout: 10,
    startingSystemHealth: 20,
    systemHealthMax: 25,
    systemHealthWear: 5,
    points: 0,
    resources: 10,
    treatments: [],
    eventCards: [],
  },
  prolificBaseline: {
    type: "prolificBaseline",
    numPlayers: 1,
    availableRoles: ["Politician", "Entrepreneur", "Researcher"],
    maxRound: { min: 8, max: 8 },
    roundTransitionDuration: 2,
    twoEventsThreshold: { min: -1, max: -1 },
    threeEventsThreshold: { min: -2, max: -2 },
    timeRemaining: 15,
    eventTimeout: 5,
    startingSystemHealth: 15,
    systemHealthMax: 25,
    systemHealthWear: 5,
    points: 0,
    resources: 10,
    treatments: [],
    eventCards: [],
  },
  prolificVariable: {
    type: "prolificVariable",
    numPlayers: 1,
    availableRoles: ["Politician", "Entrepreneur", "Researcher"],
    maxRound: { min: 11, max: 11 },
    roundTransitionDuration: 1,
    twoEventsThreshold: { min: 16, max: 16 },
    threeEventsThreshold: { min: 9, max: 9 },
    twoEventsThresholdDisplayRange: { min: 12, max: 18 },
    threeEventsThresholdDisplayRange: { min: 5, max: 11 },
    timeRemaining: 15,
    eventTimeout: 5,
    startingSystemHealth: 15,
    systemHealthMax: 25,
    systemHealthWear: 5,
    points: 0,
    resources: 10,
    treatments: [],
    eventCards: [],
  },
  // trioProlificBaseline: {
  //   type: "trioProlificBaseline",
  //   numPlayers: 3,
  //   maxRound: { min: 8, max: 8 },
  //   roundTransitionDuration: 2,
  //   twoEventsThreshold: { min: -1, max: -1 },
  //   threeEventsThreshold: { min: -2, max: -2 },
  //   timeRemaining: 20,
  //   eventTimeout: 5,
  //   startingSystemHealth: 45,
  //   systemHealthMax: 60,
  //   systemHealthWear: 15,
  //   points: 0,
  //   resources: 10,
  //   availableRoles: ["Politician", "Entrepreneur", "Researcher"]
  // treatments: [],
  // eventCards: [],
  // },
  // trioProlificVariable: {
  //   type: "trioProlificVariable",
  //   numPlayers: 3,
  //   maxRound: { min: 8, max: 8 },
  //   roundTransitionDuration: 2,
  //   twoEventsThreshold: { min: 48, max: 48 },
  //   threeEventsThreshold: { min: 27, max: 27 },
  //   twoEventsThresholdDisplayRange: { min: 36, max: 54 },
  //   threeEventsThresholdDisplayRange: { min: 15, max: 33 },
  //   timeRemaining: 20,
  //   eventTimeout: 5,
  //   startingSystemHealth: 45,
  //   systemHealthMax: 60,
  //   systemHealthWear: 15,
  //   points: 0,
  //   resources: 10,
  //   availableRoles: ["Politician", "Entrepreneur", "Researcher"]
  // treatments: [],
  // eventCards: [],
  // }
};
