import {
  AccomplishmentData, AccomplishmentSetData,
  MarsEventData,
  Phase,
  PlayerData,
  PlayerSetData,
  Role,
  ROLES
} from 'shared/types';
import { Vue } from 'vue-property-decorator';
import * as _ from 'lodash';
import { PlayerClientData, State } from '@/store/state';

function SET_GAME_PHASE(state: State, payload: Phase) {
  state.phase = payload;
}
function SET_ROUND(state: State, round: number) {
  state.round = round;
}
function SET_UPKEEP(state: State, upkeep: number) {
  state.upkeep = upkeep;
}
function ADD_TO_EVENTS(state: State, event: MarsEventData) {
  state.marsEvents.push(event);
}
function REMOVE_FROM_EVENTS(state: State, event: MarsEventData) {
  const index = _.findIndex(state.marsEvents, (el: MarsEventData) => el.id === event.id);
  state.marsEvents.splice(index, 1);
}
function CHANGE_EVENT(state: State, payload: { event: MarsEventData; index: number }) {
  Vue.set(state.marsEvents, payload.index, payload.event);
}
function SET_EVENTS_FOR_ROUND(state: State, payload: any) {
  state.marsEvents = payload;
}

export default {
  SET_GAME_PHASE,
  SET_ROUND,
  SET_UPKEEP,
  ADD_TO_EVENTS,
  REMOVE_FROM_EVENTS,
  CHANGE_EVENT,
  SET_EVENTS_FOR_ROUND,
}
