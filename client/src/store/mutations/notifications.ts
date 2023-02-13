import { State } from "@port-of-mars/shared/game/client/state";
import { MarsLogMessageData, Role } from "@port-of-mars/shared/types";

export default {
  ADD_TO_MARS_LOG(state: State, payload: MarsLogMessageData) {
    state.logs.push(payload);
  },
  REMOVE_FROM_MARS_LOG(state: State, payload: MarsLogMessageData) {
    const index = state.logs.findIndex(log => log.id == payload.id);
    state.logs.splice(index, 1);
  },
};
