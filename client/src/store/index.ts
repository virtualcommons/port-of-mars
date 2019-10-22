import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {

    // server side
    marsLog: [],
    activeAccomplishmentCards: [],
    chat: [],
    upkeep: 100,
    phaseTime: 300,
    round: 1,
    players: [],
    playerResources: {},

    // client side
    investments: {},
    layout: 'primary-layout',

  },
  mutations: {
    SET_LAYOUT(state, payload) {
      state.layout = payload;
    },
    SET_ACCS(state, payload) {
      // payload is an array of numbers
      // for all the numbers
      // activecards.push(Data(number))
    },
    ADD_TO_CHAT(state, payload) {
      this.state.chat.push(payload);
    },
  },
  getters: {
    layout(state) {
      return state.layout;
    },
  },
  actions: {
    sendChatMsg(context, message) {
      context.commit('ADD_TO_CHAT', message);
    },
  },
});
