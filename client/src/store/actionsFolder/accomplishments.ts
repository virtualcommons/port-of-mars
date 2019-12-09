export default {
  setActiveAccomplishments: function(context: any, payload: any) {
    context.commit('SET_ACTIVE_ACCOMPLISHMENTS', payload);
  },
  discardAccomplishment: function(context: any, payload: any) {
    context.commit('DISCARD_ACCOMPLISHMENT', payload);
  },
  purchaseAccomplishment: function(context: any, payload: any) {
    context.commit('PURCHASE_ACCOMPLISHMENT', payload);
  }
};
