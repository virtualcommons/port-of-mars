import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    layout: 'primary-layout',
  },
  mutations: {
    SET_LAYOUT(state, payload) {
      state.layout = payload;
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
