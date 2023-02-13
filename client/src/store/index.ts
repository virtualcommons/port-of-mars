import Vue from "vue";
import Vuex from "vuex";
import * as _ from "lodash";

import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";
import { initialStoreState } from "@port-of-mars/shared/game/client/state";

export interface StoreState {
  playerRole: string;
  timeRemaining: number;
}

Vue.use(Vuex);
const store = new Vuex.Store({
  state: _.cloneDeep(initialStoreState),
  mutations,
  getters,
  actions,
});

export default store;
