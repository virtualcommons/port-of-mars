import {State} from "@/store/state";
import { MarsLogMessageData } from 'shared/types';

export default {
  ADD_TO_MARS_LOG(state: State, payload: MarsLogMessageData) {
    state.logs.push(payload);
  },
  REMOVE_FROM_MARS_LOG(state: State, payload: MarsLogMessageData) {
    const index = state.logs.findIndex(log => log.content == payload.content);
    state.logs.splice(index, 1);
  },
  CREATE_NOTIFICATION(state: State, payload: string) {
    state.activeNotifications.push(payload);
  },
  HARD_RESET_NOTIFICATIONS(state: State,payload:string){
    state.activeNotifications = [];
  }
}
