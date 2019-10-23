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
    localInvestments: InvestmentsModel,
    
  },
  mutations: {
    SET_ACCS(state, payload) {
      // payload is an array of numbers
      // for all the numbers
      // activecards.push(Data(number))
    },
    ADD_TO_CHAT(state, payload:ChatMessage) {
      //state.chat.addEntry(payload);
    },
    SET_LOCAL_INVESTMENT(state,{investmentToChange:string,amount:number}){
      //state.localInvestments.
    }
  },
  getters: {
  },
  actions: {
    sendChatMsg(context, message) {
      context.commit('ADD_TO_CHAT', message);
    },
    addToLocalInvestment(context, payload) {
      context.commit('SET_LOCAL_INVESTMENT', payload);
    },
  },
});
