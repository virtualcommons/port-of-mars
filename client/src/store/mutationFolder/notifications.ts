import { State } from '@/store/state';
import { MarsLogMessageData, Role } from '@port-of-mars/shared/types';

export default {
  ADD_TO_MARS_LOG(state: State, payload: MarsLogMessageData) {
    state.logs.push(payload);
  },
  REMOVE_FROM_MARS_LOG(state: State, payload: MarsLogMessageData) {
    const index = state.logs.findIndex(log => log.content == payload.content);
    state.logs.splice(index, 1);
  },
  CREATE_NOTIFICATION(state: State, payload: {data:any, role:any}) {
    state.players[payload.role as Role].notifications.push(payload.data);

  },
  CLEAR_NOTIFICATION(state: State, payload:{data:number,role:any}){
    state.players[payload.role as Role].notifications.splice(payload.data,1);
  }
};
