import { PlayerClientSet, State, PlayerClientData } from '@port-of-mars/client/store/state';
import {
  ROLES,
  MarsEventData,
  EventClientView,
  MarsLogMessageData,
} from '@port-of-mars/shared/types';
import _ from 'lodash';
import { createNamespacedHelpers } from 'vuex';

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

  // unreadChatMessages(state: State): number {
  //   const chatMessages = state.messages.length;
  //   return chatMessages;
  // }
};
