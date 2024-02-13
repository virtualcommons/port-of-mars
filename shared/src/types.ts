import { Page } from "@port-of-mars/shared/routes";

export type Dictionary<T> = { [key: string]: T };

export const RESEARCHER = "Researcher" as const;
export const CURATOR = "Curator" as const;
export const PIONEER = "Pioneer" as const;
export const ENTREPRENEUR = "Entrepreneur" as const;
export const POLITICIAN = "Politician" as const;
export const SERVER = "Server" as const;
export const ROLES: Array<Role> = [CURATOR, ENTREPRENEUR, PIONEER, POLITICIAN, RESEARCHER];
export type Role = "Researcher" | "Curator" | "Pioneer" | "Entrepreneur" | "Politician";
export type ServerRole = "Server";

export type ModerationActionType = "mute" | "ban" | "none";
export const MUTE = "mute" as const;
export const BAN = "ban" as const;
export const NONE = "none" as const;
export const MODERATION_ACTION_TYPES = [MUTE, BAN, NONE];

export interface ClientSafeUser {
  id: number;
  email?: string;
  name?: string;
  username: string;
  isAdmin: boolean;
  isTeacher?: boolean;
  isMuted: boolean;
  isBanned: boolean;
  passedQuiz?: boolean;
  isVerified?: boolean;
  isSystemBot?: boolean;
  dateConsented?: Date;
  participantId?: string;
}

export interface ProfileData {
  username: string;
  name: string;
  email: string;
}

export type AuthData = ProfileData & {
  dateConsented: Date | undefined | null;
  isVerified: boolean;
};

export interface SoloHighScoreItem {
  rank: number;
  username: string;
  points: number;
  maxRound: number;
  pointsPerRound: number;
}

export type SoloHighScoreData = Array<SoloHighScoreItem>;

export interface LeaderboardItem {
  rank: number;
  username: string;
  points: number;
  wins: number;
  losses: number;
}

export interface LeaderboardData {
  withBots: Array<LeaderboardItem>;
  withoutBots: Array<LeaderboardItem>;
}

export type GameType = "freeplay" | "tournament";
export type LobbyType = GameType;

export interface LobbyChatMessageData {
  userId: number;
  username: string;
  message: string;
  dateCreated: number;
}

export interface LobbyClientData {
  id: string;
  username: string;
  ready: boolean;
}

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

export interface ChatReportData extends ChatReportRequestData {
  id: number;
  resolved: boolean;
  isBanned: boolean;
  isMuted: boolean;
  muteStrikes: number;
  dateCreated: Date;
}

export interface ModerationActionData {
  reportId: number;
  username: string;
  adminUsername: string;
  action: ModerationActionType;
  daysMuted?: number;
  revoked?: boolean;
}

export interface ModerationActionClientData {
  id: number;
  username: string;
  adminUsername: string;
  action: ModerationActionType;
  dateMuteExpires?: Date;
}

export interface AdminGameData {
  id: string;
  status: GameStatus;
  type: GameType;
  roomId: string;
  buildId: string;
  dateCreated: string;
  dateFinalized: string;
  tournamentRoundId: number;
  treatmentId?: number;
  highScore?: number;
  players: Array<{
    id: number;
    role: Role;
    userId: number;
    playerIp: string;
    gameId: number;
    points: number;
    user: ClientSafeUser;
  }>;
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
export const RESOURCES: Array<Resource> = ["culture", "finance", "government", "legacy", "science"];

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

export interface MarsEventOverride {
  eventId: string;
  quantity: number;
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

export interface SystemHealthChangesData<PurchasedSystemHealth = PurchasedSystemHealthData> {
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
  isMuted: boolean;
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
  options: Array<string>;
}

export interface QuizQuestionData {
  id: number;
  question: string;
  options: Array<string>;
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
}

export type PlayerScores = Array<{
  role: Role;
  points: number;
  winner: boolean;
  isSelf?: boolean;
}>;

export type PlayerStatItem = GameMetadata & {
  playerScores: PlayerScores;
  victory: boolean;
};

export interface SoloPlayerStatItem {
  time: number; // unix timestamp
  points: number;
  victory: boolean;
  maxRound: number;
}

export type GameStatus = "incomplete" | "defeat" | "victory" | "failure" | "incomplete";

export interface InspectData {
  players: Array<{ username: string; role: string; isBot: boolean; points: number }>;
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

export interface LobbyActivityData {
  freeplay: any[];
  tournament: any[];
}

export interface TournamentStatus {
  name: string;
  description: string;
  lobbyOpenBeforeOffset: number;
  lobbyOpenAfterOffset: number;
  signupsPopularityThreshold: number;
  currentRound: {
    round: number;
    championship: boolean;
    announcement: string;
  };
}

export interface TournamentRoundScheduleDate {
  tournamentRoundDateId: number;
  timestamp: number;
  signupCount: number;
  isSignedUp: boolean;
}

export interface TournamentRoundInviteStatus {
  id: number;
  introSurveyUrl: string;
  exitSurveyUrl: string;
  hasCompletedIntroSurvey: boolean;
  hasCompletedExitSurvey: boolean;
  hasParticipated: boolean;
}

export interface ClientInitStatus {
  isTournamentEnabled: boolean;
  isFreePlayEnabled: boolean;
  user: ClientSafeUser | null;
  tournamentStatus: TournamentStatus | null;
  tournamentRoundSchedule: Array<TournamentRoundScheduleDate> | null;
  announcementBannerText: string;
}

export interface DashboardMessage {
  kind: "success" | "danger" | "info" | "warning";
  message: string;
}

export type RoomId = string;

export interface DynamicSettingsData {
  maxConnections: number;
  defaultDaysMuted: number;
  isTournamentEnabled: boolean;
  isFreePlayEnabled: boolean;
  tournamentLobbyOpenBeforeOffset: number;
  tournamentLobbyOpenAfterOffset: number;
  tournamentSignupsPopularityThreshold: number;
  announcementBannerText: string;
}
