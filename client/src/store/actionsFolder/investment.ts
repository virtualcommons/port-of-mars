export default {
  changeLocalInvestment(context: any, payload: any) {
    context.commit('SET_INVESTMENT_AMOUNT', payload);
  }
};
