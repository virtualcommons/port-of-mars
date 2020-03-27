import { State } from '@port-of-mars/client/store/state';
import { Role, TradeData, ResourceAmountData } from '@port-of-mars/shared/types';
import { Vue } from 'vue-property-decorator';

export default {
  ADD_TO_TRADES(state: State, payload: { id: string; trade: TradeData }) {
    Vue.set(state.tradeSet, payload.id, payload.trade);
  },
  REMOVE_FROM_TRADES(state: State, payload: { id: string }) {
    Vue.delete(state.tradeSet, payload.id);
  },
};
