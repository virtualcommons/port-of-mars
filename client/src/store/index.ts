import Vue from 'vue';
import Vuex from 'vuex';
import * as _ from 'lodash';

import getters from './getters';
import mutations from './mutations';
import { initialStoreState } from '@port-of-mars/client/store/state';

export interface StoreState {
  playerRole: string;
  timeRemaining: number;
}

Vue.use(Vuex);
const store = new Vuex.Store({
  state: _.cloneDeep(initialStoreState),
  mutations,
  getters
});

export default store;
