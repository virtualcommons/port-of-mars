import {State} from "@/store/state";

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
  }
};
