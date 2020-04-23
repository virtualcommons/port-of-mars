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
  TradeDataWithNull
} from '@port-of-mars/shared/types';
import {
  ModalViewType,
  ModalDataType,
} from '@port-of-mars/client/types/modals';
import _ from 'lodash';
import { ServerErrorMessage } from '@port-of-mars/shared/types';

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
    specialty: 'science',
    inventory: defaultInventory(role),
    ready: false,
    timeBlocks: 10,
    victoryPoints: 0,
    pendingInvestments: defaultPendingInvestment(),
    contributedUpkeep: 0,
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
    upkeep: 0,
  };
}

export function defaultTradeData(): TradeDataWithNull<'' | Role> {
  return {
    to: {
      role: '',
      resourceAmount: defaultInventory(),
    },

    from: {
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
  popupView: PopupView;
  modalView: ModalView;
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

export interface PopupView {
  activeEventsVisible: boolean;
  inventoryVisible: boolean;
  marsLogVisible: boolean;
}

export interface State extends GameData {
  role: Role;
  logs: Array<MarsLogMessageData>;
  errors: Array<ServerErrorMessage>;
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
  consent: false,

  // eventView: 'ACCOMPLISHMENT_SELECT_PURCHASED',
  quizQuestions: [],
  eventCardsVisible: [],
  user: {
    username: '',
    passedQuiz: false,
  },

  //TUTORIAL TRADING
  tutorialTradePartner: '',
  tutorialTradeGive: defaultInventory(),
  tutorialTradeGet: defaultInventory(),

  userInterface: {
    profileMenuView: {
      visible: false,
    },
    popupView: {
      activeEventsVisible: false,
      inventoryVisible: false,
      marsLogVisible: false,
    },
    modalView: {
      visible: false,
      type: null,
      data: null,
    },
  },

  errors: [],

  ui: {
    // TODO: Still needs to be refactored
    tradeData: defaultTradeData(),
  },
};

export const getInitialStoreState = (): State => _.cloneDeep(initialStoreState);