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