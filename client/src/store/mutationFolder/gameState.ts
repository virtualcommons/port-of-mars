import { MarsEventData, Phase, PlayerData, Role } from 'shared/types';
import { Vue } from 'vue-property-decorator';
import * as _ from 'lodash';
import { PlayerClientData, State } from '@/store/state';

export default {
  SET_GAME_PHASE(state: State, payload: Phase) {
    state.phase = payload;
  },
  SET_ROUND(state: State, round: number) {
    state.round = round;
  },
  SET_UPKEEP(state: State, upkeep: number) {
    state.upkeep = upkeep;
  },
  ADD_TO_EVENTS(state: State, event: MarsEventData) {
    state.marsEvents.push(event);
  },
  REMOVE_FROM_EVENTS(state: State, event: MarsEventData) {
    const index = _.findIndex(state.marsEvents, (el: MarsEventData) => el.id === event.id);
    state.marsEvents.splice(index, 1);
  },
  CHANGE_EVENT(state: State, payload: { event: MarsEventData; index: number }) {
    Vue.set(state.marsEvents, payload.index, payload.event);
  },
  SET_EVENTS_FOR_ROUND(state: State, payload: any) {
    state.marsEvents = payload;
  },
  SET_PLAYER_ROLE(state: State, payload: Role) {
    state.role = payload;
  },
  SET_PLAYER(state: State, payload: { role: Role; data: PlayerData }) {
    Object.assign(state.players[payload.role], payload.data);
  }
};
