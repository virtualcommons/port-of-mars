import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // server side
    marsLog: Array<Object>(),
    activeAccCards: Array<Number>(),
    chat: Array<Object>(),
    upkeep: Number,
    phaseTime: Number,
    round: Number,
    players: Array<Object>(),
    playerResources: Object,

    // client side
    investments: Object,
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
  },
  getters: {
    layout(state) {
      return state.layout;
    },
  },
  actions: {

  },
});
