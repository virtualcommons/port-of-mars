export default {
    SET_TRADING_VIEW(state: any, newTradingView: string) {
        state.tradingView = newTradingView;
      },
      SET_TRADING_MEMBER(state: any, newTradingMember: string) {
        state.tradingMember = newTradingMember;
      },
}