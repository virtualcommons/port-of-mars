import Vue from 'vue';
import Vuex from 'vuex';
import * as _ from 'lodash';
import { InvestmentsModel, ChatModel } from '../models';

import actions from './actions';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

export const initialStoreState = {
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

  // state variable for layout
  layout: 'default-layout',

  // notification
  notifMessage: '',

  // state variables for trading modal
  tradingView: 'request',
  tradingMember: 'Curator',

  // this will be merged with the global investments
  // at the end of each round.
  localInvestments: new InvestmentsModel(),
};

export default new Vuex.Store({
  state: _.cloneDeep(initialStoreState),

  mutations,

  getters,

  actions,
});
