import {BaseInvestmentCosts, GetAccomplishmentsByPerson} from '@/models';
import {MarsEventData} from "shared/types";
import {Vue} from "vue-property-decorator";

export default {
  SET_GAME_PHASE(state: any, payload: string) {
    state.gamePhase = payload;
  },
  SET_ROUND(state: any, round: number) {
    state.round = round;
  },
  SET_UPKEEP(state: any, upkeep: number) {
    state.upkeep = upkeep;
  },
  ADD_TO_EVENTS(state: any, event: MarsEventData) {
    state.gameEvents.push(event);
  },
  REMOVE_FROM_EVENTS(state: any, index: number) {
    state.gameEvents.splice(index, 1);
  },
  CHANGE_EVENT(state: any, payload: {event: MarsEventData, index: number}) {
    Vue.set(state.gameEvents, payload.index, payload.event);
  },
  SET_EVENTS_FOR_ROUND(state: any, payload: any) {
    state.gameEvents = payload;
    // console.log(state.gameEvents);
  },
  SET_PLAYER_ROLE(state: any, payload: string) {
    state.playerRole = payload;
    console.log('PLAYER ROLE (MUTATION): ', state.playerRole);

    Object.keys(BaseInvestmentCosts[payload]).forEach(key => {
      state.localInvestments.updateCurrentCost(key, BaseInvestmentCosts[payload][key]);
    });

    state.activeAccomplishmentCards = GetAccomplishmentsByPerson(state.playerRole, 3);
  },
  SET_PLAYER_FINISHED(state: any, payload: boolean) {
    state.playerFinishedWithPhase = payload;
  },
}
