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
  QuizQuestionData,
  QuizResultPackage
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
    accomplishment: {
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
    contributedUpkeep: 0
  };
}

function defaultCostData(role: Role): ResourceCostData {
  return {
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0,
    upkeep: 0
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
    upkeep: 0
  };
}

export interface User {
  username: string
  passedQuiz: boolean
}

export interface State extends GameData {
  role: Role;
  logs: Array<MarsLogMessageData>;
  players: PlayerClientSet;
  phase: Phase;
  layout: string;
  loading: boolean;
  activeNotifications: Array<String>;
  quizQuestions: Array<QuizQuestionData>;
  quizResults: Array<QuizResultPackage>;
  eventCardsVisible: Array<any>;
  user: User
}

export const initialStoreState: State = {
  // GameData
  players: defaultPlayerClientSet(),
  timeRemaining: 300,
  round: 1,
  phase: Phase.pregame,
  upkeep: 100,
  messages: [],
  marsEvents: [],
  logs: [],
  marsEventsProcessed: 0,
  tradeSet: {},

  // State
  role: RESEARCHER,
  layout: 'game',
  loading: false,

  activeNotifications: [],
  // eventView: 'ACCOMPLISHMENT_SELECT_PURCHASED',
  quizQuestions: [],
  quizResults: [],
  eventCardsVisible: [],
  user: {
    username: '',
    passedQuiz: false
  },
};

function tutorialNotifications() {
  const state = _.cloneDeep(initialStoreState);
  state.activeNotifications = [
    'Welcome to Port of Mars',
    'Notifications can be dismissed by clicking on them'
  ];
  return state;
}
