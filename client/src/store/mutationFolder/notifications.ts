<<<<<<< HEAD
import {State} from "@/store/state";

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
  ADD_TO_MARS_LOG(state: State, payload: string) {
    // correct location for this?
    // if (payload !== '') {
    //   state.marsLog.push(payload);
    // }
    const data = {
      initiator: state.playerRole,
      category: 'upkeep',
      content: payload,
      time: new Date(),
    };
    state.marsLog.addEntry(data);
  },
  CREATE_NOTIFICATION(state: State, payload:string) {
<<<<<<< HEAD
<<<<<<< HEAD
=======
    // let timer = setTimeout(()=> false,1000);
    // const data = {
    //   timer,
    //   message:payload,
    // }

>>>>>>> [refactor] investment data sends to server
=======
>>>>>>> [refactor]Server handles notifications
    state.activeNotifications.push(payload);
  }
}
=======
export default {
    SET_NOTIFICATION_MESSAGE(state: any, payload: string) {
        state.notifMessage = payload;
      },
      SET_NOTIFICATION_STATUS(state: any, payload: string) {
        state.notifIsActive = payload;
      },
      SET_TIME_REMAINING(state: any, payload: number) {
        state.timeRemaining = payload;
      },
      ADD_TO_MARS_LOG(state: any, payload: string) {
        // correct location for this?
        // if (payload !== '') {
        //   state.marsLog.push(payload);
        // }
        state.marsLog.addEntry(payload);
      }
}
>>>>>>> [refactor] store is modular
