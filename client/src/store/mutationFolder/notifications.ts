import {State} from "@/store/state";
import { MarsLogMessageData } from 'shared/types';

export default {
  // SET_NOTIFICATION_MESSAGE(state: State, payload: string) {
  //   state.notifMessage = payload;
  // },
  // SET_NOTIFICATION_STATUS(state: State, payload: string) {
  //   state.notifIsActive = payload;
  // },
  // SET_TIME_REMAINING(state: State, payload: number) {
  //   state.timeRemaining = payload;
  // },
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
  HARD_RESET_MARS_LOG(state:State, payload:string){
    state.logs = [];
  },
  HARD_RESET_NOTIFICATIONS(state: State,payload:string){
    state.activeNotifications = [];
  }
}
