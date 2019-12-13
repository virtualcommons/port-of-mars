import {State} from "@/store/state";
import {MarsLogData} from "shared/types";

export default {
  ADD_TO_MARS_LOG(state: State, payload:MarsLogData) {
    const data = {
      initiator: state.role,
      category: payload.category,
      content: payload.message,
      time: new Date(),
    };
    state.marsLog.addEntry(data);
  },
  HARD_RESET_MARS_LOG(state:State, payload:string){
    state.marsLog.hardReset();
  },

  CREATE_NOTIFICATION(state: State, payload:string) {

    state.activeNotifications.push(payload);
  },
  HARD_RESET_NOTIFICATIONS(state: State,payload:string){
    state.activeNotifications = [];
  }
}
