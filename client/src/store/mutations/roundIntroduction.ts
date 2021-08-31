import Vue from 'vue';
import {State} from "@port-of-mars/shared/game/client/state";
import {AccomplishmentPurchaseData, RoundIntroductionData, SystemHealthMarsEventData, TradeData} from "@port-of-mars/shared/types";
import _ from 'lodash';

function SET_ROUND_INTRODUCTION_FIELD(state: State, { field, value }: { field: string, value: number}) {
  (state.roundIntroduction as any)[field] = value;
}

function ADD_TO_ROUND_INTRO_SYSTEM_HEALTH_MARS_EVENTS(state: State, payload: SystemHealthMarsEventData) {
  state.roundIntroduction.systemHealthMarsEvents.push(payload);
}

function REMOVE_FROM_ROUND_INTRO_SYSTEM_HEALTH_MARS_EVENTS(state: State, payload: SystemHealthMarsEventData) {
  const marsEvents = state.roundIntroduction.systemHealthMarsEvents;
  const index = marsEvents.findIndex(e => _.isEqual(e, payload));
  if (index === -1) {
    return;
  }
  marsEvents.splice(index, 1);
}

function ADD_TO_ROUND_INTRO_ACCOMPLISHMENT_PURCHASES(state: State, payload: AccomplishmentPurchaseData) {
  console.log("Adding to round intro acc purchases: ", payload);
  state.roundIntroduction.accomplishmentPurchases.push(payload);
}

function REMOVE_FROM_ROUND_INTRO_ACCOMPLISHMENT_PURCHASES(state: State, payload: AccomplishmentPurchaseData) {
  const accPurchases = state.roundIntroduction.accomplishmentPurchases;
  const index = accPurchases.findIndex(e => _.isEqual(e, payload));
  if (index === -1) {
    console.log("Did not find accomplishment purchase for : ", payload);
    return;
  }
  console.log("removing purchase from round intro: ", payload);
  accPurchases.splice(index, 1);
}

function ADD_TO_ROUND_INTRO_COMPLETED_TRADES(state: State, payload: TradeData) {
  state.roundIntroduction.completedTrades.push(payload);
}

function REMOVE_FROM_ROUND_INTRO_COMPLETED_TRADES(state: State, payload: TradeData) {
  const completedTrades = state.roundIntroduction.completedTrades;
  const index = completedTrades.findIndex(e => _.isEqual(e, payload));
  if (index === -1) {
    return;
  }
  completedTrades.splice(index, 1);
}

export default {
  ADD_TO_ROUND_INTRO_ACCOMPLISHMENT_PURCHASES,
  ADD_TO_ROUND_INTRO_SYSTEM_HEALTH_MARS_EVENTS,
  ADD_TO_ROUND_INTRO_COMPLETED_TRADES,
  REMOVE_FROM_ROUND_INTRO_ACCOMPLISHMENT_PURCHASES,
  REMOVE_FROM_ROUND_INTRO_COMPLETED_TRADES,
  REMOVE_FROM_ROUND_INTRO_SYSTEM_HEALTH_MARS_EVENTS,
  SET_ROUND_INTRODUCTION_FIELD,
}
