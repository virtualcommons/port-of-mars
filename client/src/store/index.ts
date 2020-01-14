import Vue from 'vue';
import Vuex from 'vuex';
import * as _ from 'lodash';

import getters from './getters';
import mutations from './mutationFolder';
import { initialStoreState } from '@/store/state';

export interface StoreState {
  playerRole: string;
  timeRemaining: number;
}

Vue.use(Vuex);

export default new Vuex.Store({
  state: _.cloneDeep(initialStoreState),

  mutations,

  getters
});
