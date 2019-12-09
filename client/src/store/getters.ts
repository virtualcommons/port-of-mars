import {State} from "@/store/state";
import { InvestmentTypes } from "@/models/InvestmentsData";

export default {
  /**
   * layout() getter
   * Gets the state out of state variable layout.
   * @return The state of layout.
   *
   */
  layout(state: State) {
    console.log('CURRENT LAYOUT: ', state.layout);
    return state.layout;
  },

  player(state: State) {
    return state.players[state.role];
  }
};
