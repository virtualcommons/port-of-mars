import {
  CURATOR,
  ENTREPRENEUR,
  DashboardMessage,
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
} from "@port-of-mars/shared/types";
import {
  ModalType,
  ModalDataType,
} from "@port-of-mars/shared/game/client/modals";
import {
  ChatMarsLogView,
  HUDLeftView,
  HUDRightView,
} from "@port-of-mars/shared/game/client/panes";
import _ from "lodash";
import { SYSTEM_HEALTH_MAINTENANCE_COST } from "@port-of-mars/shared/settings";
import {
  ChatMessageData,
  MarsEventData,
  RoundIntroductionData,
  TradeSetData,
} from "../../types";

export const ROLE_TO_INVESTMENT_DATA: {
  [role in Role]: Array<keyof InvestmentData>;
} = {
  [CURATOR]: [
    "systemHealth",
    "culture",
    "finance",
    "legacy",
    "government",
    "science",
  ],
  [ENTREPRENEUR]: [
    "systemHealth",
    "finance",
    "culture",
    "government",
    "legacy",
    "science",
  ],
  [POLITICIAN]: [
    "systemHealth",
    "government",
    "finance",
    "science",
    "culture",
    "legacy",
  ],
  [RESEARCHER]: [
    "systemHealth",
    "science",
    "government",
    "legacy",
    "culture",
    "finance",
  ],
  [PIONEER]: [
    "systemHealth",
    "legacy",
    "culture",
    "science",
    "finance",
    "government",
  ],
};

export interface PlayerClientData extends PlayerData {
  pendingInvestments: InvestmentData;
}

// FIXME: this will need to change if/when we move to multiple players per role
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
    specialty: "science",
    inventory: defaultInventory(role),
    ready: false,
    timeBlocks: 10,
    victoryPoints: 0,
    pendingInvestments: defaultPendingInvestment(),
    systemHealthChanges: {
      investment: 0,
      purchases: [],
    },
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

export function defaultTradeData(): TradeDataWithNull<"" | Role> {
  return {
    recipient: {
      role: "",
      resourceAmount: defaultInventory(),
    },

    sender: {
      role: "Researcher",
      resourceAmount: defaultInventory(),
    },
  };
}

export interface User {
  username: string;
  passedQuiz?: boolean;
  isVerified?: boolean;
  dateConsented?: Date;
  participantId?: string;
}

// NOTE :: State - userInterface

export interface UserInterface {
  profileMenuView: ProfileMenuView;
  chatMarsLogView: ChatMarsLogView;
  hudLeftView: HUDLeftView;
  hudRightView: HUDRightView;
  modal: Modal;
  toggleResourceCost: boolean;
  toggleYourTrades: boolean;
}

// TODO: rename interface to something more descriptive
export interface UserInterfaceTwo {
  tradeData: TradeDataWithNull<"" | Role>;
}

export interface Modal {
  type: ModalType | null;
  data: ModalDataType | null;
}

export interface ProfileMenuView {
  visible: boolean;
}

export interface State extends GameData {
  timeRemaining: number;
  round: number;
  systemHealth: number;
  messages: Array<ChatMessageData>;
  marsEvents: Array<MarsEventData>;
  marsEventsProcessed: number;
  roundIntroduction: RoundIntroductionData;
  tradeSet: TradeSetData;
  role: Role;
  winners: Array<Role>;
  heroOrPariah: "" | "hero" | "pariah";
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
  // TODO: rename UserInterfaceTwo to something more descriptive
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
    systemHealthGroupContributions: new Map<string, number>(),
    systemHealthAtStartOfRound: 100,
    systemHealthMarsEvents: [],
    systemHealthMaintenanceCost: -SYSTEM_HEALTH_MAINTENANCE_COST,
    accomplishmentPurchases: [],
    completedTrades: [],
  },
  tradeSet: {},
  winners: [],
  heroOrPariah: "",

  // State
  role: RESEARCHER,
  layout: "game",
  loading: false,
  environment: "development",
  consent: false,

  // eventView: 'ACCOMPLISHMENT_SELECT_PURCHASED',
  quizQuestions: [],
  eventCardsVisible: [],
  user: {
    username: "",
    passedQuiz: false,
    isVerified: false,
  },

  // TUTORIAL TRADING
  tutorialTradePartner: "",
  tutorialTradeGive: defaultInventory(),
  tutorialTradeGet: defaultInventory(),

  userInterface: {
    profileMenuView: {
      visible: false,
    },
    chatMarsLogView: ChatMarsLogView.Chat,
    hudLeftView: HUDLeftView.OtherPlayers,
    hudRightView: HUDRightView.PhaseInformation,
    modal: {
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
