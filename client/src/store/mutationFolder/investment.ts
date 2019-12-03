import {State} from "@/store/state";

export default {
  CHANGE_LOCAL_INVESTMENT(state: State, payload: any) {
    // this is for increment and decrement
    state.localInvestments.changeInventoryValue(payload.investmentName, payload.investmentAmount);
  },
}
