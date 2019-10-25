import Vue from 'vue';
import Vuex from 'vuex';
import { InvestmentsModel,ChatModel,ChatMessage }  from "../models";
Vue.use(Vuex);



export default new Vuex.Store({
  state: {
    // server side
    marsLog: [],
    activeAccomplishmentCards: [],
    chat: ChatModel,
    upkeep: 100,
    phaseTime: 300,
    round: 1,
    players: [],
    playerResources: {},

    // client side
    //investments: {},
    layout: 'primary-layout',

    //this will be merged with the global investments
    //at the end of each round.
    localInvestments: new InvestmentsModel,
    
  },
  mutations: {                              // changes state
    SET_ACCS(state, payload) {
      // payload is an array of numbers
      // for all the numbers
      // activecards.push(Data(number))
    },
    ADD_TO_CHAT(state, payload:ChatMessage) {
      //state.chat.addEntry(payload);
    },
    CHANGE_LOCAL_INVESTMENT(state:any, payload){
      //this is for increment and decrement
      state.localInvestments.changeValue(payload.investmentName,payload.investmentAmount);

    },
    SET_LAYOUT(state, payload) {            // change state of the layout state
      state.layout = payload;
    }

  },
  getters: {
    layout (state) {                        // get state of layout variable
      return state.layout;
    }
  },
  actions: {
    sendChatMsg(context, message) {
      context.commit('ADD_TO_CHAT', message);
    },
    changeLocalInvestment(context, payload) {
      context.commit('CHANGE_LOCAL_INVESTMENT', payload);
    },
  },
});
