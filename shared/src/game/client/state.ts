import {
  // onboarding interface store data
  DashboardMessage,
  TournamentStatus,
  // game data
  CURATOR,
  ENTREPRENEUR,
  PIONEER,
  POLITICIAN,
  RESEARCHER,
  ChatMessageData,
  GameData,
  Investment,
  InvestmentData,
  MarsEventData,
  MarsLogMessageData,
  RoundIntroductionData,
  TradeSetData,
  Phase,
  PlayerData,
  QuizQuestionData,
  ResourceAmountData,
  ResourceCostData,
  Role,
  TradeDataWithNull,
  LobbyType,
  LobbyChatMessageData,
  LobbyClientData,
  ClientSafeUser,
  GameType,
  TournamentRoundScheduleDate,
} from "@port-of-mars/shared/types";
import { ModalType, ModalDataType } from "@port-of-mars/shared/game/client/modals";
import { ChatMarsLogView, HUDLeftView, HUDRightView } from "@port-of-mars/shared/game/client/panes";
import { settings } from "@port-of-mars/shared/settings";

export const ROLE_TO_INVESTMENT_DATA: {
  [role in Role]: Array<Investment>;
} = {
  [CURATOR]: ["systemHealth", "culture", "finance", "legacy", "government", "science"],
  [ENTREPRENEUR]: ["systemHealth", "finance", "culture", "government", "legacy", "science"],
  [POLITICIAN]: ["systemHealth", "government", "finance", "science", "culture", "legacy"],
  [RESEARCHER]: ["systemHealth", "science", "government", "legacy", "culture", "finance"],
  [PIONEER]: ["systemHealth", "legacy", "culture", "science", "finance", "government"],
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
    username: "",
    isBot: false,
    accomplishments: {
      purchased: [],
      purchasable: [],
    },
    costs: defaultCostData(),
    botWarning: false,
    specialty: "science",
    inventory: defaultInventory(),
    ready: false,
    timeBlocks: 10,
    isCompulsivePhilanthropist: false,
    isMuted: false,
    victoryPoints: 0,
    pendingInvestments: defaultPendingInvestment(),
    systemHealthChanges: {
      investment: 0,
      purchases: [],
    },
  };
}

function defaultCostData(): ResourceCostData {
  return {
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0,
    systemHealth: 0,
  };
}

export function defaultInventory(): ResourceAmountData {
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

export type User = ClientSafeUser;

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

export interface Lobby {
  clients: Array<LobbyClientData>;
  groupSize: number;
  chat: Array<LobbyChatMessageData>;
  ready: boolean;
  dateCreated: number;
  type: LobbyType;
}

export interface GameState extends GameData {
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
  gameType: GameType;
  logs: Array<MarsLogMessageData>;
  players: PlayerClientSet;
  phase: Phase;
  layout: string;
  loading: boolean;
  quizQuestions: Array<QuizQuestionData>;
  eventCardsVisible: Array<any>;
  environment: string;
  consent: boolean;

  tutorialTradePartner: string;
  tutorialTradeGive: ResourceAmountData;
  tutorialTradeGet: ResourceAmountData;
  userInterface: UserInterface;
  // TODO: rename UserInterfaceTwo to something more descriptive
  ui: UserInterfaceTwo;
}

// webapp data: consider refactoring to separate in-game store data with
// normal onboarding store data
export interface State extends GameState {
  user: User;
  lobby: Lobby;
  dashboardMessages: Array<DashboardMessage>;
  tournamentStatus: TournamentStatus | null;
  tournamentRoundSchedule: Array<TournamentRoundScheduleDate> | null;
  isFreePlayEnabled: boolean;
  isTournamentEnabled: boolean;
  announcementBannerText: string;
}

export const initialUserState: User = {
  id: 0,
  username: "",
  isAdmin: false,
  isMuted: false,
  isBanned: false,
  passedQuiz: false,
  isVerified: false,
};

export function defaultLobbyState(): Lobby {
  return {
    groupSize: 5,
    clients: [],
    chat: [],
    ready: false,
    dateCreated: 0,
    type: "freeplay",
  };
}

export const initialGameState: GameState = {
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
    systemHealthMaintenanceCost: -settings.SYSTEM_HEALTH_MAINTENANCE_COST,
    accomplishmentPurchases: [],
    completedTrades: [],
  },
  tradeSet: {},
  winners: [],
  heroOrPariah: "",
  gameType: "freeplay",

  // State
  role: RESEARCHER,
  layout: "game",
  loading: false,
  environment: "development",
  consent: false,

  // eventView: 'ACCOMPLISHMENT_SELECT_PURCHASED',
  quizQuestions: [],
  eventCardsVisible: [],

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

  ui: {
    // TODO: Still needs to be refactored
    tradeData: defaultTradeData(),
  },
};

export const initialStoreState: State = {
  ...initialGameState,
  lobby: defaultLobbyState(),
  user: initialUserState,
  dashboardMessages: [],
  tournamentStatus: null,
  tournamentRoundSchedule: null,
  isFreePlayEnabled: true,
  isTournamentEnabled: false,
  announcementBannerText: "",
};
