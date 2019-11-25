export default {
    CHANGE_LOCAL_INVESTMENT(state: any, payload: any) {
        // this is for increment and decrement
        state.localInvestments.changeInventoryValue(payload.investmentName, payload.investmentAmount);
      },
}