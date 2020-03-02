import {
  Phase,
  RESEARCHER,
  Role,
  ResourceCostData,
  ResourceAmountData,
  PlayerData,
  InvestmentData,
  CURATOR,
  ENTREPRENEUR,
  POLITICIAN,
  PIONEER,
  GameData,
  MarsLogMessageData,
  QuizQuestionData
} from 'shared/types';
import _ from 'lodash';

export interface PlayerClientData extends PlayerData {
  pendingInvestments: InvestmentData;
}

export type PlayerClientSet = { [role in Role]: PlayerClientData };

function defaultPlayerClientSet(): PlayerClientSet {
  return {
    Curator: defaultPlayerData(CURATOR),
    Entrepreneur: defaultPlayerData(ENTREPRENEUR),
    Politician: defaultPlayerData(POLITICIAN),
    Pioneer: defaultPlayerData(PIONEER),
    Researcher: defaultPlayerData(RESEARCHER)
  };
}

function defaultPlayerData(role: Role): PlayerClientData {
  return {
    role,
    accomplishments: {
      bought: [],
      purchasable: []
    },
    costs: defaultCostData(role),
    specialty: 'science',
    inventory: defaultInventory(role),
    ready: false,
    timeBlocks: 10,
    victoryPoints: 0,
    pendingInvestments: defaultPendingInvestment(),
    contributedUpkeep: 0,
    notifications: []
  };
}

function defaultCostData(role: Role): ResourceCostData {
  return {
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0,
    upkeep: 0,
  };
}

export function defaultInventory(role?: Role): ResourceAmountData {
  return {
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0
  };
}

export function defaultPendingInvestment(): ResourceCostData {
  return {
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0,
    upkeep: 0,
  };
}

export interface User {
  username: string;
  passedQuiz: boolean;
}

export interface State extends GameData {
  role: Role;
  logs: Array<MarsLogMessageData>;
  players: PlayerClientSet;
  phase: Phase;
  layout: string;
  loading: boolean;
  quizQuestions: Array<QuizQuestionData>;
  eventCardsVisible: Array<any>;
  user: User;
  lobbyNextAssignmentTime: number;
  lobbyWaitingUsers: number;
  lobbyClientJoinedQueue: boolean;
  lobbyReceivedInvitation: boolean;
  environment: string;
}

export const initialStoreState: State = {
  // GameData
  players: defaultPlayerClientSet(),
  timeRemaining: 300,
  round: 1,
  phase: Phase.invest,
  upkeep: 100,
  messages: [],
  marsEvents: [],
  logs: [],
  marsEventsProcessed: 0,
  tradeSet: {},
  winners: [],

  // State
  role: RESEARCHER,
  layout: 'game',
  loading: false,
  environment: 'development',

  // eventView: 'ACCOMPLISHMENT_SELECT_PURCHASED',
  quizQuestions: [],
  eventCardsVisible: [],
  user: {
    username: '',
    passedQuiz: false
  },

  // NOTE: Waiting Lobby
  lobbyNextAssignmentTime: 0,
  lobbyWaitingUsers: 0,
  lobbyClientJoinedQueue: false,
  lobbyReceivedInvitation: false,
};
