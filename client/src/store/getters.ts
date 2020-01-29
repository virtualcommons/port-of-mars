import { PlayerClientSet, State } from '@/store/state';
import { ROLES,MarsEventData,EventClientView } from 'shared/types';

export default {
  /**
   * layout() getter
   * Gets the state out of state variable layout.
   * @return The state of layout.
   *
   */
  layout(state: State) {
    return state.layout;
  },

  player(state: State) {
    return state.players[state.role];
  },

  logs(state: State) {
    return state.logs;
  },

  otherPlayers(state: State) {
    let op: Partial<PlayerClientSet> = {};
    for (const role of ROLES) {
      if (role !== state.role) {
        op[role] = state.players[role];
      }
    }
    return op;
  },

  currentEvent(state: State): MarsEventData | undefined {
    const marsEvents = state.marsEvents;
    const marsEventsProcessed = state.marsEventsProcessed;
    const current = marsEvents[marsEventsProcessed];
    if(current) {
      return current;
    }
    return undefined;
  },

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
};
