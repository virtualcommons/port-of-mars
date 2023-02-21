import { State } from "@port-of-mars/shared/game/client/state";
import {
  AccomplishmentPurchaseData,
  SystemHealthMarsEventData,
  TradeData,
} from "@port-of-mars/shared/types";
import _ from "lodash";

function SET_ROUND_INTRODUCTION_FIELD(
  state: State,
  { field, value }: { field: string; value: number }
) {
  (state.roundIntroduction as any)[field] = value;
}

function ADD_TO_ROUND_INTRO_SYSTEM_HEALTH_MARS_EVENTS(
  state: State,
  payload: SystemHealthMarsEventData
) {
  state.roundIntroduction.systemHealthMarsEvents.push(payload);
}

function REMOVE_FROM_ROUND_INTRO_SYSTEM_HEALTH_MARS_EVENTS(
  state: State,
  payload: SystemHealthMarsEventData
) {
  const marsEvents = state.roundIntroduction.systemHealthMarsEvents;
  const index = marsEvents.findIndex(e => _.isEqual(e, payload));
  if (index === -1) {
    return;
  }
  marsEvents.splice(index, 1);
}

function ADD_TO_ROUND_INTRO_ACCOMPLISHMENT_PURCHASES(
  state: State,
  payload: AccomplishmentPurchaseData
) {
  state.roundIntroduction.accomplishmentPurchases.push(payload);
}

function REMOVE_FROM_ROUND_INTRO_ACCOMPLISHMENT_PURCHASES(
  state: State,
  payload: AccomplishmentPurchaseData
) {
  const accPurchases = state.roundIntroduction.accomplishmentPurchases;
  const index = accPurchases.findIndex(e => _.isEqual(e, payload));
  if (index === -1) {
    console.log("Did not find accomplishment purchase for : ", payload);
    return;
  }
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

function ADD_TO_ROUND_INTRO_SYSTEM_HEALTH_GROUP_CONTRIBUTIONS(
  state: State,
  payload: { playerId: string; value: number }
) {
  state.roundIntroduction.systemHealthGroupContributions.set(payload.playerId, payload.value);
}

function UPDATE_SYSTEM_HEALTH_GROUP_CONTRIBUTION(
  state: State,
  payload: { playerId: string; value: number }
) {
  state.roundIntroduction.systemHealthGroupContributions.set(payload.playerId, payload.value);
}

export default {
  ADD_TO_ROUND_INTRO_ACCOMPLISHMENT_PURCHASES,
  ADD_TO_ROUND_INTRO_SYSTEM_HEALTH_MARS_EVENTS,
  ADD_TO_ROUND_INTRO_COMPLETED_TRADES,
  REMOVE_FROM_ROUND_INTRO_ACCOMPLISHMENT_PURCHASES,
  REMOVE_FROM_ROUND_INTRO_COMPLETED_TRADES,
  REMOVE_FROM_ROUND_INTRO_SYSTEM_HEALTH_MARS_EVENTS,
  SET_ROUND_INTRODUCTION_FIELD,
  ADD_TO_ROUND_INTRO_SYSTEM_HEALTH_GROUP_CONTRIBUTIONS,
  UPDATE_SYSTEM_HEALTH_GROUP_CONTRIBUTION,
};
