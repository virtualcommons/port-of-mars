import Vue from 'vue';
import {State} from "@port-of-mars/shared/game/client/state";
import {RoundIntroductionData} from "@port-of-mars/shared/types";

function SET_ROUND_INTRODUCTION(state: State, payload: RoundIntroductionData) {
  Vue.set(state, 'roundIntroduction', payload)
}

export default {
  SET_ROUND_INTRODUCTION
}
