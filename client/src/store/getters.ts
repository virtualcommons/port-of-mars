import {PlayerClientData, PlayerClientSet, State} from "@/store/state";
import { InvestmentTypes } from "@/models/InvestmentsData";
import * as _ from 'lodash'
import {Role, ROLES} from "shared/types";

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
    return state.marsLog.marsLog;
  },

  otherPlayers(state: State) {
    let op: Partial<PlayerClientSet> = {};
    for (const role of ROLES) {
      if (role !== state.role) {
        op[role] = state.players[role];
      }
    }
    return op;
  }
};
