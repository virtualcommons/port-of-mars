export default {
  setTradingView(context: any, payload: any) {
    context.commit('SET_TRADING_VIEW', payload);
  },
  setTradingMember(context: any, payload: any) {
    context.commit('SET_TRADING_MEMBER', payload);
  }
};
