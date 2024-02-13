import {
  User,
  PlayerClientData,
  PlayerClientSet,
  State,
} from "@port-of-mars/shared/game/client/state";
import {
  EventClientView,
  MarsEventData,
  MarsLogCategory,
  MarsLogMessageData,
  Phase,
  ROLES,
} from "@port-of-mars/shared/types";

export default {
  isAuthenticated(state: State): boolean {
    return state.user?.username !== "";
  },

  isAdmin(state: State): boolean {
    return state.user?.isAdmin;
  },

  isTeacher(state: State): boolean {
    return state.user?.isTeacher || false;
  },

  hasConsented(state: State): boolean {
    return !!state.user?.dateConsented;
  },

  isVerified(state: State): boolean {
    return !!state.user?.isVerified;
  },

  user(state: State): User {
    return state.user;
  },
  /**
   * Gets the state out of state variable layout.
   * @returns The string value of the current layout.
   *
   */
  layout(state: State): string {
    return state.layout;
  },

  /**
   * Gets the current player by the current role.
   * @param state The current state of the game.
   * @returns The current player.
   *
   */
  player(state: State): PlayerClientData {
    return state.players[state.role];
  },

  /**
   * Gets the current player by the current role.
   * @param state The current state of the game.
   * @returns The current player.
   *
   */
  ready(state: State): boolean {
    return state.players[state.role].ready;
  },

  /**
   * Gets 5 player roles.
   */
  roles() {
    return ROLES;
  },

  /**
   * Gets mars log messages.
   * @param state The current state of the game.
   * @returns The array containing mars log messages.
   *
   */
  logs(state: State): MarsLogMessageData[] {
    return state.logs;
  },

  /**
   * Gets set of players that do not include the user's player.
   * @param state The current state of the game.
   * @returns A set of 4 players.
   *
   */
  otherPlayers(state: State): Partial<PlayerClientSet> {
    const op: Partial<PlayerClientSet> = {};
    for (const role of ROLES) {
      if (role !== state.role) {
        op[role] = state.players[role];
      }
    }
    return op;
  },

  /**
   * Gets the current event.
   * @param state The current state of the game.
   * @returns The current event in effect.
   *
   */
  currentEvent(state: State): MarsEventData | undefined {
    const marsEvents = state.marsEvents;
    const marsEventsProcessed = state.marsEventsProcessed;
    const current = marsEvents[marsEventsProcessed];
    if (current) {
      return current;
    }
    return undefined;
  },

  /**
   * During events phase, gets current view of the center bottom container.
   * @param state The current state of the game.
   * @returns The current event view.
   *
   */
  currentEventView(state: State): EventClientView {
    const marsEvents = state.marsEvents;
    const marsEventsProcessed = state.marsEventsProcessed;
    const current = marsEvents[marsEventsProcessed];
    if (current) {
      const view = current.clientViewHandler;
      return view;
    }
    return "NO_CHANGE";
  },

  /**
   * Gets Audit event if it has been drawn for a given round.
   * @param state The current state of the game.
   * @returns The boolean value that determines if an audit event exists
   *
   */
  isUnderAudit(state: State): boolean {
    const marsEvents = state.marsEvents;
    const eventProcessedIndex = state.marsEventsProcessed;
    const auditEventIndex = marsEvents.findIndex(event => event.id === "audit");
    return auditEventIndex !== -1 && auditEventIndex <= eventProcessedIndex;
  },

  isEffortsWastedActive(state: State): boolean {
    const marsEvents = state.marsEvents;
    const processedIndex = state.marsEventsProcessed;
    const effortsWastedIndex = marsEvents.findIndex(event => event.id === "effortsWasted");
    return (
      state.phase === Phase.events &&
      effortsWastedIndex !== -1 &&
      effortsWastedIndex <= processedIndex
    );
  },

  isChatAvailable(state: State): boolean {
    const marsEvents = state.marsEvents;
    const eventProcessedIndex = state.marsEventsProcessed;
    const solarFlareIndex = marsEvents.findIndex(event => event.id === "solarFlare");
    return !(solarFlareIndex !== -1 && eventProcessedIndex <= eventProcessedIndex);
  },

  categoryColorMap(): Map<string, string> {
    return new Map([
      // round
      [MarsLogCategory.newRound, "var(--light-shade-05)"],

      // system health
      [MarsLogCategory.systemHealth, "var(--marslog-red)"],
      [MarsLogCategory.systemHealthContributions, "var(--marslog-red)"],

      // trade
      [MarsLogCategory.trade, "var(--marslog-purple)"],
      [MarsLogCategory.sentTrade, "var(--marslog-purple)"],
      [MarsLogCategory.acceptTrade, "var(--marslog-purple)"],
      [MarsLogCategory.rejectTrade, "var(--marslog-purple)"],
      [MarsLogCategory.cancelTrade, "var(--marslog-purple)"],
      [MarsLogCategory.invalidTrade, "var(--marslog-purple)"],

      // accomplishment
      [MarsLogCategory.accomplishment, "var(--marslog-green)"],
      [MarsLogCategory.purchaseAccomplishment, "var(--marslog-green)"],
    ]);
  },

  systemHealth(state: State): number {
    return state.systemHealth;
  },

  isFirstRound(state: State): boolean {
    return state.round === 1;
  },

  heroOrPariah(state: State) {
    return state.heroOrPariah;
  },

  toggleYourTrades(state: State) {
    return state.userInterface.toggleYourTrades;
  },

  lobbyPlayerReadiness(state: State) {
    return state.lobby.clients.find(client => client.username === state.user?.username)?.ready;
  },

  tournamentStatus(state: State) {
    return state.tournamentStatus;
  },

  tournamentRoundHasUpcomingLaunch(state: State) {
    return !!state.tournamentRoundSchedule?.length;
  },

  tournamentSchedule(state: State) {
    return state.tournamentRoundSchedule;
  },

  nextLaunchTime(state: State) {
    if (state.tournamentRoundSchedule?.length) {
      return state.tournamentRoundSchedule[0].timestamp;
    }
  },

  isTournamentLobbyOpen(state: State) {
    if (!state.tournamentStatus || !state.tournamentRoundSchedule?.length) {
      return false;
    }
    const beforeOffset = state.tournamentStatus.lobbyOpenBeforeOffset;
    const afterOffset = state.tournamentStatus.lobbyOpenAfterOffset;
    const nextLaunchTime = state.tournamentRoundSchedule[0].timestamp;
    const timeNow = new Date().getTime();
    return timeNow >= nextLaunchTime - beforeOffset && timeNow <= nextLaunchTime + afterOffset;
  },
};
