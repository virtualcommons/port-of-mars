import {State} from "@/store/state";
import {Role} from "shared/types";

export default {
  SET_TRADING_VIEW(state: State, newTradingView: string) {
    state.tradingView = newTradingView;
  },
  SET_TRADING_MEMBER(state: State, newTradingMember: Role) {
    state.tradingMember = newTradingMember;
  },
}
