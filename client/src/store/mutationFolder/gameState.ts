import {
  AccomplishmentData,
  AccomplishmentSetData,
  MarsEventData,
  Phase,
  PlayerData,
  PlayerSetData,
  Role,
  ROLES
} from 'shared/types';
import { Vue } from 'vue-property-decorator';
import * as _ from 'lodash';
import {
  defaultPendingInvestment,
  PlayerClientData,
  State
} from '@/store/state';

function SET_GAME_PHASE(state: State, payload: Phase) {
  state.phase = payload;
}
function SET_ROUND(state: State, round: number) {
  state.round = round;
  for (const role of ROLES) {
    state.players[role].pendingInvestments = defaultPendingInvestment();
  }
}
function SET_UPKEEP(state: State, upkeep: number) {
  state.upkeep = upkeep;
}

// MUTATIONS FOR EVENTS :: START

function SET_MARS_EVENTS_PROCESSED(state: State, marsEventsProcessed: number) {
  state.marsEventsProcessed = marsEventsProcessed;
}

function ADD_TO_EVENTS(state: State, event: MarsEventData) {
  // TODO: REMOVE AFTER REFACTOR
  const initVisbilityObject = { id: event.id, visible: false };
  state.eventCardsVisible.push(initVisbilityObject);

  state.marsEvents.push(event);
}

function REMOVE_FROM_EVENTS(state: State, event: MarsEventData) {
  const index = _.findIndex(
    state.marsEvents,
    (el: MarsEventData) => el.id === event.id
  );
  state.marsEvents.splice(index, 1);
}

function CHANGE_EVENT(
  state: State,
  payload: { event: MarsEventData; index: number }
) {
  // TODO: REMOVE AFTER REFACTOR
  const initVisbilityObject = { id: payload.event.id, visible: false };
  state.eventCardsVisible.push(initVisbilityObject);

  Vue.set(state.marsEvents, payload.index, payload.event);
}

function SET_EVENTS_FOR_ROUND(state: State, payload: any) {
  state.marsEvents = payload;
}

function SET_EVENT_VISIBILITY(
  state: State,
  payload: { id: number; visibility: boolean }
) {
  for (const [i, value] of state.eventCardsVisible.entries()) {
    if (value.id === payload.id) {
      state.eventCardsVisible[i].visible = payload.visibility;
    }
  }
}

function SET_USERNAME(
  state: State,
  payload: { username: string }
) {
  state.username = payload.username;
}

// MUTATIONS FOR EVENTS :: END

function SET_TIME_REMAINING(state: State, timeRemaining: number) {
  state.timeRemaining = timeRemaining;
}

// TODO: REMOVE BEFORE DEPLOY
function TOGGLE_LOADING(state: State) {
  const reverse = !state.loading;
  state.loading = reverse;
}

export default {
  SET_GAME_PHASE,
  SET_ROUND,
  SET_UPKEEP,
  ADD_TO_EVENTS,
  REMOVE_FROM_EVENTS,
  CHANGE_EVENT,
  SET_EVENTS_FOR_ROUND,
  SET_EVENT_VISIBILITY,
  SET_TIME_REMAINING,
  SET_MARS_EVENTS_PROCESSED,
  SET_USERNAME,
  TOGGLE_LOADING
};
