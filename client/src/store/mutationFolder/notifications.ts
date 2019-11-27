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
        const data = {
          initiator: state.playerRole,
          category: 'upkeep',
          content: payload,
          time: new Date().toLocaleString(),
        }
        state.marsLog.addEntry(data);
      }
}