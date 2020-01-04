import { State } from '@/store/state';
import { Role, TradeData } from 'shared/types';
import { Vue } from 'vue-property-decorator';

export default {
  ADD_TO_TRADES(state: State, payload: { id: string; trade: TradeData }) {
    Vue.set(state.tradeSet, payload.id, payload.trade);
  },
  REMOVE_FROM_TRADES(state: State, payload: { id: string }) {
    Vue.delete(state.tradeSet, payload.id);
  }
};
