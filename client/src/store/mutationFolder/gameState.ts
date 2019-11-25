<<<<<<< HEAD
import {MarsEventData, Phase, Role} from "shared/types";
import {Vue} from "vue-property-decorator";
import * as _ from 'lodash'
import {State} from "@/store/state";

export default {
  SET_GAME_PHASE(state: State, payload: Phase) {
    state.gamePhase = payload;

    if(payload == Phase.trade){
      state.localInvestments.confirmInvestments();
    }
  },
  SET_ROUND(state: State, round: number) {
    state.round = round;
  },
  SET_UPKEEP(state: State, upkeep: number) {
    state.upkeep = upkeep;
  },
  ADD_TO_EVENTS(state: State, event: MarsEventData) {
    state.gameEvents.push(event);
  },
  REMOVE_FROM_EVENTS(state: State, event: MarsEventData) {
    const index = _.findIndex(state.gameEvents, (el: MarsEventData) => el.id === event.id);
    state.gameEvents.splice(index, 1);
  },
  CHANGE_EVENT(state: State, payload: {event: MarsEventData, index: number}) {
    Vue.set(state.gameEvents, payload.index, payload.event);
  },
  SET_EVENTS_FOR_ROUND(state: State, payload: any) {
    state.gameEvents = payload;
    // console.log(state.gameEvents);
  },
  SET_PLAYER_ROLE(state: State, payload: Role) {
    state.playerRole = payload;
    console.log('PLAYER ROLE (MUTATION): ', state.playerRole);



    // state.activeAccomplishmentCards = GetAccomplishmentsByPerson(state.playerRole, 3);
  },
}
=======
import { BaseInvestmentCosts, GetAccomplishmentsByPerson } from '@/models';

export default {
    SET_GAME_PHASE(state: any, payload: string) {
        state.gamePhase = payload;
        if (payload === 'Upkeep') {
          state.round += 1;
    
          //VERY BASIC IMPLEMENTATION; WILL NEED TO BE REFACTORED
          state.upkeep += state.localInvestments.returnValues.upkeep.persistentInventory;
          state.localInvestments.returnValues.upkeep.persistentInventory = 0;
        }
        if (payload === 'Trading') {
          state.localInvestments.confirmInvestments();
        }
      },
    
      SET_EVENTS_FOR_ROUND(state: any, payload: any) {
        state.gameEvents = payload;
        // console.log(state.gameEvents);
      },
    
      CHANGE_UPKEEP_AMOUNT(state: any, payload: number) {
        if (state.upkeep - payload >= 0) {
          state.upkeep -= payload;
        }
      },
      SET_PLAYER_ROLE(state: any, payload: string) {
        state.playerRole = payload;
        console.log('PLAYER ROLE (MUTATION): ', state.playerRole);
    
        Object.keys(BaseInvestmentCosts[payload]).forEach(key => {
          state.localInvestments.updateCurrentCost(key, BaseInvestmentCosts[payload][key]);
        });
    
        state.activeAccomplishmentCards = GetAccomplishmentsByPerson(state.playerRole,3);
      },
      SET_PLAYER_FINISHED(state: any, payload: boolean) {
        state.playerFinishedWithPhase = payload;
      },
}
>>>>>>> [refactor] store is modular
