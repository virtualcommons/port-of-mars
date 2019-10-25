import Vue from 'vue';
import Vuex from 'vuex';
import { InvestmentsModel, ChatModel, ChatMessage } from '../models';

Vue.use(Vuex);



export default new Vuex.Store({
  state: {
    // server side
    playerRole: '',
    marsLog: [],
    activeAccomplishmentCards: [],
    chat: new ChatModel(),
    upkeep: 100,
    phaseTime: 300,
    round: 1,
    players: [],
    timeblocks: 10,
    playerResources: {},

    // client side
    // investments: {},
    layout: 'primary-layout',

    // this will be merged with the global investments
    // at the end of each round.
    localInvestments: new InvestmentsModel(),
  },
  mutations: {
    SET_ACCS(state, payload) {
      // payload is an array of numbers
      // for all the numbers
      // activecards.push(Data(number))
    },
    ADD_TO_CHAT(state, payload: ChatMessage) {
      state.chat.addEntry(payload);
    },
    CHANGE_LOCAL_INVESTMENT(state: any, payload) {
      // this is for increment and decrement

      state.localInvestments.changeInventoryValue(payload.investmentName, payload.investmentAmount);
    },
    CHANGE_LOCAL_ROUND_COSTS(state, payload) {
      for (const investment in payload) {
        // console.log(investment,payload[investment]);
        state.localInvestments.updateCurrentCost(investment, payload[investment]);
      }
    },
    SET_PLAYER_ROLE(state,payload){
      state.playerRole = payload;
    }
    
  },
  getters: {},
  actions: {
    sendChatMsg(context, message: ChatMessage) {
      context.commit('ADD_TO_CHAT', message);
    },
    changeLocalInvestment(context, payload) {
      context.commit('CHANGE_LOCAL_INVESTMENT', payload);
    },
    updateRoundCosts(context, payload) {
      context.commit('CHANGE_LOCAL_ROUND_COSTS', payload);
    },
    setPlayerRole(context,payload){
      context.commit('SET_PLAYER_ROLE',payload);
    }
  },
});
