import Vue from 'vue';
import Vuex from 'vuex';
import * as _ from 'lodash';
import {
  InvestmentsModel, ChatModel, MarsLogModel, RawGameEvent,
} from '../models';

import actions from './actions';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

export const initialStoreState = {
  // server side
  playerRole: '',
  marsLog: new MarsLogModel(),
  activeAccomplishmentCards: [],
  chat: new ChatModel(),
  upkeep: 100,
  round: 1,
  players: [],
  timeblocks: 10,
  playerResources: {},
  gameEvents: [],

  // phase
  gamePhase: '',
  phaseTime: 300,
  playerFinishedWithPhase: false,

  // state variable for layout
  layout: 'default-layout',

  // notification
  notifIsActive: 'inactive',
  notifMessage: '',

  // state variables for trading modal
  tradingView: 'request',
  tradingMember: 'Curator',

  // state variables for card modal
  cardData: {},

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
