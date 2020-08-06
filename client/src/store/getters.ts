import {PlayerClientData, PlayerClientSet, State} from '@port-of-mars/shared/game/client/state';
import {
  EventClientView,
  MarsEventData,
  MarsLogCategory,
  MarsLogMessageData,
  ROLES,
} from '@port-of-mars/shared/types';

export default {
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
    let op: Partial<PlayerClientSet> = {};
    for (const role of ROLES) {
      if (role !== state.role) {
        op[role] = state.players[role];
      }
    }
    return op;
  },

  // tradeFilter(state: State): boolean {
  //   return state.userInterface.toggleYourTrades;
  // },

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
    if(current) {
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
    if(current) {
      const view = current.clientViewHandler;
      return view;
    }
    return 'NO_CHANGE';
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
    const auditEventIndex = marsEvents.findIndex(event => event.id === 'audit');
    return auditEventIndex !== -1 && auditEventIndex <= eventProcessedIndex;
  },

  categoryColorMap(state: State): Map<string, string> {

    return new Map([
      // round
      [MarsLogCategory.newRound, 'var(--light-shade-05)'],

      // system health
      [MarsLogCategory.systemHealth, 'var(--marslog-red)'],

      // trade
      [MarsLogCategory.trade, 'var(--marslog-purple)'],
      [MarsLogCategory.sentTrade, 'var(--marslog-purple)'],
      [MarsLogCategory.acceptTrade, 'var(--marslog-purple)'],
      [MarsLogCategory.rejectTrade, 'var(--marslog-purple)'],
      [MarsLogCategory.cancelTrade, 'var(--marslog-purple)'],
      [MarsLogCategory.invalidTrade, 'var(--marslog-purple)'],

      // accomplishment
      [MarsLogCategory.accomplishment, 'var(--marslog-green)'],
      [MarsLogCategory.purchaseAccomplishment, 'var(--marslog-green)'],
    ]);
  },

  systemHealth(state: State): number {
    return state.upkeep;
  },

  isFirstRound(state: State): boolean {
    return state.round === 1;
  },

  systemHealthContributed(state: State): number {
    return state.players[state.role].systemHealthChanges.investment;
  },

  totalSystemHealthContributions(state: State): number {
    let contributed = 0;
    for (const role of ROLES) {
      contributed += state.players[role].systemHealthChanges.investment;
    }
    return contributed;
  },

  totalTakenSystemHealth(state: State): number {
    let taken = 0;
    for (const role of ROLES) {
      for (const p of state.players[role].systemHealthChanges.purchases) {
        taken += p.systemHealth;
      }
    }
    return taken;
  },

  purchaseSystemHealth(state: State): Array<{label: string; role: string; value: number}> {
    const purchases: Array<{label: string; role: string; value: number}> = []
    for (const role of ROLES) {
      purchases.splice(
        purchases.length,
        0,
        ...state.players[role].systemHealthChanges.purchases.map(p => ({ label: p.description, role, value: p.systemHealth})));
    }
    return purchases;
  },

  heroOrPariah(state: State) {
    return state.heroOrPariah;
  }
}
