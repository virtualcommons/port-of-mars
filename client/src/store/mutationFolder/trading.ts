import { State } from '@/store/state';
import { Role, TradeData, ResourceAmountData } from 'shared/types';
import { Vue } from 'vue-property-decorator';

export default {
  ADD_TO_TRADES(state: State, payload: { id: string; trade: TradeData }) {
    Vue.set(state.tradeSet, payload.id, payload.trade);
  },
  REMOVE_FROM_TRADES(state: State, payload: { id: string }) {
    Vue.delete(state.tradeSet, payload.id);
  },

  SET_GET_RESOURCES(state: State, payload: ResourceAmountData){
    state.tutorialTradeGet = payload;
  },

  SET_GIVE_RESOURCES(state: State, payload: ResourceAmountData){
    state.tutorialTradeGive = payload;
  },

  SET_TRADE_PARTNER_NAME(state: State, payload: string){
    state.tutorialTradePartner = payload;

  }
};
