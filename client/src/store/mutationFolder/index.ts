import accomplishments from "./accomplishments";
import chat from "./chat";
import gameState from "./gameState";
import investment from "./investment";
import notifications from "./notifications";
import trading from "./trading";

export default {
  SET_LAYOUT(state: any, newLayout: string) {
    state.layout = newLayout;
  },

  ...accomplishments,
  ...chat,
  ...gameState,
  ...investment,
  ...notifications,
  ...trading,
}
