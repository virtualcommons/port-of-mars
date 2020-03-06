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
    //state.tutorialTradeGet = payload;
    state.ui.tradeData.from.resourceAmount = payload;
  },

  SET_SEND_RESOURCES(state: State, payload: ResourceAmountData){
    //state.tutorialTradeGive = payload;
    state.ui.tradeData.to.resourceAmount = payload;
  },

  SET_TRADE_PARTNER_NAME(state: State, payload: Role){
    //state.tutorialTradePartner = payload;
    state.ui.tradeData.to.role = payload;
  },

  SET_TRADE_PLAYER_NAME(state: State, payload: Role){
    state.ui.tradeData.from.role = payload;
  }
};
