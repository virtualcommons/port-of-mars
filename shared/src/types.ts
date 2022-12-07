import { Page } from "@port-of-mars/shared/routes";

export type Dictionary<T> = { [key: string]: T };

export const RESEARCHER: "Researcher" = "Researcher";
export const CURATOR: "Curator" = "Curator";
export const PIONEER: "Pioneer" = "Pioneer";
export const ENTREPRENEUR: "Entrepreneur" = "Entrepreneur";
export const POLITICIAN: "Politician" = "Politician";
export const SERVER: "Server" = "Server";
export const ROLES: Array<Role> = [
  CURATOR,
  ENTREPRENEUR,
  PIONEER,
  POLITICIAN,
  RESEARCHER,
];
export type Role =
  | "Researcher"
  | "Curator"
  | "Pioneer"
  | "Entrepreneur"
  | "Politician";
export type ServerRole = "Server";

export interface ChatMessageData {
  message: string;
  role: string;
  dateCreated: number;
  round: number;
}

export interface ChatReportRequestData {
  // bare-minimum data that the client sends off when creating a chat report
  roomId: string;
  username: string;
  message: ChatMessageData;
}

export interface ChatReportData extends ChatReportRequestData{
  id: number;
  resolved: boolean;
  isBanned: boolean;
  dateCreated: Date;
}

export interface MarsLogData {
  category: string;
  message: string;
}

export interface ResourceAmountData {
  science: number;
  government: number;
  legacy: number;
  finance: number;
  culture: number;
}

export interface InvestmentData extends ResourceAmountData {
  systemHealth: number;
}

export type ResourceCostData = InvestmentData;

export type Resource = keyof ResourceAmountData;
export type Investment = keyof InvestmentData;
export const INVESTMENTS: Array<Investment> = [
  "culture",
  "finance",
  "government",
  "legacy",
  "science",
  "systemHealth",
];
export const RESOURCES: Array<Resource> = [
  "culture",
  "finance",
  "government",
  "legacy",
  "science",
];

export const INVESTMENT_LABELS: { [k in keyof InvestmentData]: string } = {
  culture: "Culture",
  finance: "Finance",
  government: "Government",
  legacy: "Legacy",
  science: "Science",
  systemHealth: "System Health",
};

export enum Phase {
  newRound,
  events,
  invest,
  trade,
  purchase,
  discard,
  victory,
  defeat,
}

export const PHASE_LABELS: { [k in Phase]: string } = {
  [Phase.newRound]: "New Round",
  [Phase.events]: "Events",
  [Phase.invest]: "Investment",
  [Phase.trade]: "Trade",
  [Phase.purchase]: "Purchase",
  [Phase.discard]: "Discard",
  [Phase.victory]: "Victory!",
  [Phase.defeat]: "Defeat!",
};

export type EventClientView =
  // EventNoChange (TODO)
  | "NO_CHANGE"
  | "AUDIT"
  | "DISABLE_CHAT"
  // EventVote
  | "VOTE_YES_NO"
  | "VOTE_FOR_PLAYER_SINGLE"
  | "VOTE_FOR_PLAYER_HERO_PARIAH"
  // EventInfluences
  | "INFLUENCES_SELECT"
  | "INFLUENCES_DRAW"
  // EventAccomplishments
  | "ACCOMPLISHMENT_SELECT_PURCHASED";

export interface AccomplishmentPurchaseData {
  name: string;
  victoryPoints: number;
  systemHealthModification: number;
}

export interface SystemHealthMarsEventData {
  label: string;
  systemHealthModification: number;
}

export interface RoundIntroductionData<
  SystemHealth = SystemHealthMarsEventData,
  AccomplishmentPurchase = AccomplishmentPurchaseData,
  Trade = TradeData
> {
  systemHealthGroupContributions: Map<string, number>;
  systemHealthAtStartOfRound: number;
  systemHealthMaintenanceCost: number;
  systemHealthMarsEvents: Array<SystemHealth>;
  accomplishmentPurchases: Array<AccomplishmentPurchase>;
  completedTrades: Array<Trade>;
}

export interface MarsEventData {
  id: string;
  name: string;
  effect: string;
  flavorText: string;
  clientViewHandler: EventClientView;
  duration: number;
  // real time duration of the round in seconds (overrides the default phase length)
  timeDuration?: number;
}

export enum MarsLogCategory {
  audit = "AUDIT",
  newRound = "NEW ROUND",
  systemHealth = "SYSTEM HEALTH",
  systemHealthContributions = "PLAYER CONTRIBUTIONS",
  event = "EVENT",
  trade = "TRADE",
  accomplishment = "ACCOMPLISHMENT",
  purchaseAccomplishment = "PURCHASE ACCOMPLISHMENT",
  sentTrade = "SENT TRADE",
  invalidTrade = "INVALID TRADE",
  acceptTrade = "ACCEPT TRADE",
  rejectTrade = "REJECT TRADE",
  cancelTrade = "CANCELLED TRADE",
}

export interface MarsLogData {
  category: string;
  message: string;
}

export interface MarsLogMessageData {
  performedBy: Role | ServerRole;
  category: string;
  content: string;
  round: number;
  timestamp: number;
  id: number;
}

export interface AccomplishmentData {
  id: number;
  role: Role;
  label: string;
  flavorText: string;
  science: number;
  government: number;
  legacy: number;
  finance: number;
  culture: number;
  systemHealth: number;
  victoryPoints: number;
  effect: string;
}

export interface AccomplishmentSetData<Accomplishment = AccomplishmentData> {
  purchased: Array<Accomplishment>;
  purchasable: Array<Accomplishment>;
}

export interface TradeAmountData {
  role: Role;
  resourceAmount: ResourceAmountData;
}

export type TradeStatus = "Active" | "Accepted" | "Rejected" | "Cancelled";

export interface TradeData<TradeAmount = TradeAmountData> {
  id: string;
  sender: TradeAmount;
  recipient: TradeAmount;
  status: TradeStatus;
}

export type NullPartner = "";

export interface TradeAmountDataWithNull<R> {
  role: R;
  resourceAmount: ResourceAmountData;
}

export interface TradeDataWithNull<R = Role | NullPartner> {
  sender: TradeAmountDataWithNull<R>;
  recipient: TradeAmountDataWithNull<R>;
}

export type TradeSetData<Trade = TradeData> = Record<string, Trade>;

export interface PurchasedSystemHealthData {
  description: string;
  systemHealth: number;
}

export interface SystemHealthChangesData<
  PurchasedSystemHealth = PurchasedSystemHealthData
> {
  investment: number;
  purchases: Array<PurchasedSystemHealth>;
}

export interface PlayerData<
  AccomplishmentSet = AccomplishmentSetData,
  ResourceAmount = ResourceAmountData,
  SystemHealthChanges = SystemHealthChangesData
> {
  role: Role;
  username: string;
  isBot: boolean;
  costs: ResourceCostData;
  botWarning: boolean;
  specialty: Resource;
  accomplishments: AccomplishmentSet;
  ready: boolean;
  timeBlocks: number;
  systemHealthChanges: SystemHealthChanges;
  isCompulsivePhilanthropist: boolean;
  victoryPoints: number;
  inventory: ResourceAmount;
}

export type PlayerSetData<Player = PlayerData> = { [role in Role]: Player };

export interface GameData<
  ChatMessage = ChatMessageData,
  MarsEvent = MarsEventData,
  MarsLogMessage = MarsLogMessageData,
  PlayerSet = PlayerSetData,
  RoundIntroduction = RoundIntroductionData,
  TradeSet = TradeSetData
> {
  players: PlayerSet;
  timeRemaining: number;
  round: number;
  phase: Phase;
  systemHealth: number;
  messages: Array<ChatMessage>;
  marsEvents: Array<MarsEvent>;
  logs: Array<MarsLogMessage>;
  marsEventsProcessed: number;
  roundIntroduction: RoundIntroduction;
  tradeSet: TradeSet;
  winners: Array<Role>;
  heroOrPariah: "" | "hero" | "pariah";
}

export interface QuizData {
  id: number;
  question: string;
  correct: number;
  options: Array<String>;
}

export interface QuizQuestionData {
  id: number;
  question: string;
  options: Array<String>;
}

export interface ActionItem {
  done: boolean;
  description: string;
  redoable: boolean;
  link:
    | { kind: "internal"; data: { name: Page; params?: Dictionary<string> } }
    | { kind: "external"; data: string };
}

export interface GameMetadata {
  time: number; // unix timestamp
  round: number;
  tournamentName: string;
}

export type PlayerScores = Array<{
  role: Role;
  points: number;
  winner: boolean;
}>;

export type PlayerStatItem = GameMetadata & {
  playerScores: PlayerScores;
  victory: boolean;
};

export interface Stats {
  games: Array<PlayerStatItem>;
}

export interface GameStatus {
  status: "incomplete" | "defeat" | "victory" | "failure" | "incomplete";
}

export interface InspectData {
  players: Array<{ username: string, role: string, isBot: boolean }>;
  systemHealth: number;
  marsLog: Array<MarsLogMessageData>;
  chatMessages: Array<ChatMessageData>;
}

export interface AdminStats {
  totalGames: number; // completed games
  activeGames: number;
  defeats: { withBots: number; withoutBots: number };
  victories: { withBots: number; withoutBots: number };
  totalUsers: number;
  reportedUsers: { resolved: number; unresolved: number };
  bannedUsers: number;
}

export interface PlayerTaskCompletion {
  mustVerifyEmail: boolean;
  mustConsent: boolean;
  mustTakeTutorial: boolean;
  mustTakeIntroSurvey: boolean;
  canPlayGame: boolean;
  shouldTakeExitSurvey: boolean;
  hasInvite: boolean;
}

export interface TournamentStatus {
  round: number;
  schedule: Array<number>; // list of timestamps for upcoming games
  championship: boolean;
  announcement: string;
  description: string;
}

export interface DashboardData {
  user: { username: string };
  playerTaskCompletion: PlayerTaskCompletion;
  introSurveyUrl: string;
  exitSurveyUrl: string;
  schedule: Array<number>; // list of timestamps for upcoming games
  isSignUpEnabled: boolean;
  isLobbyOpen: boolean;
  minutesOpenAfter: number;
  currentRoundNumber: number;
  stats: Stats;
}

export interface DashboardMessage {
  kind: "success" | "danger" | "info" | "warning";
  message: string;
}

export type RoomId = string;
