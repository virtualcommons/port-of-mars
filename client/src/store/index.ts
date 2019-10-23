import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {

    // server side
    marsLog: [],
    activeAccomplishmentCards: [],
    chat: Array<string>(),
    upkeep: 100,
    phaseTime: 300,
    round: 1,
    players: [],
    playerResources: {},

    // client side
    investments: {},

    layout: 'default-layout',               // define state variable for layout

    // this will be merged with the global investments
    // at the end of each round.
    localInvestments: {
      government: 0,
      legacy: 0,
      upkeep: 0,
      finace: 0,
      science: 0,
      culture: 0,
    },
  },
  mutations: {                              // changes state
    SET_ACCS(state, payload) {
      // payload is an array of numbers
      // for all the numbers
      // activecards.push(Data(number))
    },
    ADD_TO_CHAT(state, payload) {
      // this.state.chat.push(payload);
    },
    SET_LOCAL_INVESTMENT(state:object, payload:object) {
      // state.localInvestments[payload.name] = payload.amount;
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
    addToLocalInvestment(context, payload) {
      context.commit('SET_LOCAL_INVESTMENT', payload);
    },
  },
});
