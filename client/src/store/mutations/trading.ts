import { State } from '@port-of-mars/shared/game/client/state';
import { Role, TradeData, ResourceAmountData, TradeStatus } from '@port-of-mars/shared/types';
import { Vue } from 'vue-property-decorator';

export default {
  ADD_TO_TRADES(state: State, payload: { id: string; trade: TradeData }) {
    Vue.set(state.tradeSet, payload.id, payload.trade);
  },
  REMOVE_FROM_TRADES(state: State, payload: { id: string }) {
    Vue.delete(state.tradeSet, payload.id);
  },

  UPDATE_TRADE_STATUS(state: State, payload: {id: string, status: TradeStatus}){
    state.tradeSet.get(payload.id)!.status = payload.status;
  }
};
