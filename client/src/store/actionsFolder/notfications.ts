export default {
  setNotificationMessage(context: any, payload: string) {
    context.commit('SET_NOTIFICATION_MESSAGE', payload);
  },
  setNotificationStatus(context: any, payload: string) {
    context.commit('SET_NOTIFICATION_STATUS', payload);
  },
  addToMarsLog(context: any, payload: any) {
    context.commit('ADD_TO_MARS_LOG', payload);
  }
};
