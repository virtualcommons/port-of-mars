import {
  CURATOR,
  ENTREPRENEUR,
  GameData,
  InvestmentData,
  MarsLogMessageData,
  Phase,
  PIONEER,
  PlayerData,
  POLITICIAN,
  QuizQuestionData,
  RESEARCHER,
  ResourceAmountData,
  ResourceCostData,
  Role,
  TradeDataWithNull,
} from '../../types';
import {
  ModalViewType,
  ModalDataType,
} from './modals';
import {
  ChatMarsLogView,
  HUDLeftView,
  HUDRightView,
} from './panes';
import _ from 'lodash';
import { DashboardMessage } from '../../types';
import {SYSTEM_HEALTH_MAINTENANCE_COST} from "../../settings";

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
    Researcher: defaultPlayerData(RESEARCHER),
  };
}

function defaultPlayerData(role: Role): PlayerClientData {
  return {
    role,
    accomplishments: {
      purchased: [],
      purchasable: [],
    },
    costs: defaultCostData(role),
    botWarning: false,
    specialty: 'science',
    inventory: defaultInventory(role),
    ready: false,
    timeBlocks: 10,
    victoryPoints: 0,
    pendingInvestments: defaultPendingInvestment(),
    systemHealthChanges: {
      investment: 0,
      purchases: []
    }
  };
}

function defaultCostData(role: Role): ResourceCostData {
  return {
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0,
    systemHealth: 0,
  };
}

export function defaultInventory(role?: Role): ResourceAmountData {
  return {
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0,
  };
}

export function defaultPendingInvestment(): ResourceCostData {
  return {
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0,
    systemHealth: 0,
  };
}

export function defaultTradeData(): TradeDataWithNull<'' | Role> {
  return {
    recipient: {
      role: '',
      resourceAmount: defaultInventory(),
    },

    sender: {
      role: 'Researcher',
      resourceAmount: defaultInventory(),
    },
  };
}

export interface User {
  username: string;
  passedQuiz?: boolean;
}

// NOTE :: State - userInterface

export interface UserInterface {
  profileMenuView: ProfileMenuView;
  chatMarsLogView: ChatMarsLogView;
  hudLeftView: HUDLeftView;
  hudRightView: HUDRightView;
  modalView: ModalView;
  toggleResourceCost: boolean;
  toggleYourTrades: boolean;
}

export interface UserInterfaceTwo {
  tradeData: TradeDataWithNull<'' | Role>;
  // modalViews: Modals;
}

export interface ModalView {
  visible: boolean;
  type: ModalViewType | null;
  data: ModalDataType | null;
}

export interface ProfileMenuView {
  visible: boolean;
}

export interface State extends GameData {
  role: Role;
  logs: Array<MarsLogMessageData>;
  dashboardMessages: Array<DashboardMessage>;
  players: PlayerClientSet;
  phase: Phase;
  layout: string;
  loading: boolean;
  quizQuestions: Array<QuizQuestionData>;
  eventCardsVisible: Array<any>;
  user: User;
  environment: string;
  consent: boolean;

  tutorialTradePartner: string;
  tutorialTradeGive: ResourceAmountData;
  tutorialTradeGet: ResourceAmountData;
  userInterface: UserInterface;
  ui: UserInterfaceTwo;
}

export const initialStoreState: State = {
  // GameData
  players: defaultPlayerClientSet(),
  timeRemaining: 300,
  round: 1,
  phase: Phase.newRound,
  systemHealth: 100,
  messages: [],
  marsEvents: [],
  logs: [],
  marsEventsProcessed: 0,
  roundIntroduction: {
    systemHealthContributed: 0,
    systemHealthTaken: 0,
    maintenanceSystemHealth: -SYSTEM_HEALTH_MAINTENANCE_COST,
    accomplishmentPurchases: [],
    completedTrades: []
  },
  tradeSet: {},
  winners: [],
  heroOrPariah: '',

  // State
  role: RESEARCHER,
  layout: 'game',
  loading: false,
  environment: 'development',
  consent: false,

  // eventView: 'ACCOMPLISHMENT_SELECT_PURCHASED',
  quizQuestions: [],
  eventCardsVisible: [],
  user: {
    username: '',
    passedQuiz: false,
  },

  // TUTORIAL TRADING
  tutorialTradePartner: '',
  tutorialTradeGive: defaultInventory(),
  tutorialTradeGet: defaultInventory(),

  userInterface: {
    profileMenuView: {
      visible: false,
    },
    chatMarsLogView: ChatMarsLogView.Split,
    hudLeftView: HUDLeftView.OtherPlayers,
    hudRightView: HUDRightView.PhaseInformation,
    modalView: {
      visible: false,
      type: null,
      data: null,
    },
    toggleResourceCost: false,
    toggleYourTrades: false,
  },

  dashboardMessages: [],

  ui: {
    // TODO: Still needs to be refactored
    tradeData: defaultTradeData(),
  },
};

export const getInitialStoreState = (): State => _.cloneDeep(initialStoreState);
