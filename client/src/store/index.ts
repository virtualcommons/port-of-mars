import Vue from 'vue';
import Vuex from 'vuex';
import * as _ from 'lodash';
import { InvestmentsModel, MarsLogModel, RawGameEvent } from '../models';

import actions from './actionsFolder';
import getters from './getters';
import mutations from './mutationFolder';

export interface StoreState {
  playerRole: string;
  timeRemaining: number;
}

Vue.use(Vuex);

export const initialStoreState = {
  // server side
  playerRole: '',
  playerScore: 0,
  marsLog: new MarsLogModel(),
  activeAccomplishmentCards: [],
  boughtAccomplishmentCards: [],
  chat: [],
  upkeep: 100,
  round: 1,
  players: [],
  timeblocks: 10,
  timeRemaining: 300,
  playerResources: {},
  gameEvents: [],

  // phase
  gamePhase: '',
  // playerFinishedWithPhase: false,

  // state variable for layout
  layout: 'default-layout',

  // notification
  notifIsActive: 'inactive',
  notifMessage: '',

  // state variables for trading modal
  tradingView: 'request',
  tradingMember: 'Curator',

  // this will be merged with the global investments
  // at the end of each round.
  localInvestments: new InvestmentsModel()
};

export default new Vuex.Store({
  state: _.cloneDeep(initialStoreState),

  mutations,

  getters,

  actions
});
