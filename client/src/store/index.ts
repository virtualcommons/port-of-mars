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

    // state variable for layout
    layout: 'default-layout',

    // this will be merged with the global investments
    // at the end of each round.
    localInvestments: new InvestmentsModel(),
  },
  mutations: { // changes state

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
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
    SET_PLAYER_ROLE(state,payload){
      state.playerRole = payload;
    }
    
=======
    SET_LAYOUT(state, payload) { // change state of the layout state
      state.layout = payload;
=======

>>>>>>> feat: add button to game that uses tutorial layout
    /**
     * SET_LAYOUT() mutation
     * Changes the state of the layout state.
     * @param state The state of the application.
     * @param payload The string value of layout.
     *
     */
    SET_LAYOUT(state: any, newLayout: string) {
      state.layout = newLayout;
<<<<<<< HEAD
=======
>>>>>>> 6665ef2... feat: add button to game that uses tutorial layout
>>>>>>> feat: add button to game that uses tutorial layout
    },

  },
  getters: {

    /**
   * layout() getter
   * Gets the state out of state variable layout.
   * @return The state of layout.
   *
   */
    layout(state) {
      return state.layout;
    },
<<<<<<< HEAD
    SET_PLAYER_ROLE(state, payload) {
      state.playerRole = payload;
    },
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 2a53ed8... feat: start implementation of dynamic layouts using Vuex and VueRouter (#31)
=======
<<<<<<< HEAD
    SET_PLAYER_ROLE(state,payload){
      state.playerRole = payload;
    }
=======
>>>>>>> 6591497... refactor: implement dynamic layouts with store
>>>>>>> 03c6741... feat: create dynamic layout components
=======
    SET_PLAYER_ROLE(state,payload){
      state.playerRole = payload;
    },
>>>>>>> 6665ef2... feat: add button to game that uses tutorial layout
>>>>>>> feat: add button to game that uses tutorial layout
  },
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
    setPlayerRole(context, payload) {
      context.commit('SET_PLAYER_ROLE', payload);
    },
  },
});
