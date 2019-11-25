import {GetAccomplishmentsByPerson, buyAccomplishment } from '@/models';

export default {
    SET_ACTIVE_ACCOMPLISHMENTS(state: any, payload: any) {
        //state.activeAccomplishmentCards = payload;
        state.activeAccomplishmentCards = GetAccomplishmentsByPerson(state.playerRole, payload);
      },
      DISCARD_ACCOMPLISHMENT(state:any,payload:any){
        let index = _.findIndex(state.activeAccomplishmentCards, (e) => e.label == payload);
        let newAccomplishment = GetAccomplishmentsByPerson(state.playerRole,1)[0];
        
        if(newAccomplishment != undefined){
          state.activeAccomplishmentCards[index].inCurrentDeck = false;
          state.activeAccomplishmentCards.splice(index,1,newAccomplishment);
        }
      },
      PURCHASE_ACCOMPLISHMENT(state: any, payload: any) {
        let bought = state.localInvestments.canPurchaseAccomplishment(payload.totalCostArray, false);
        if (bought) {
          buyAccomplishment(payload.label);
          state.boughtAccomplishmentCards.push(payload);
    
          state.playerScore += payload.victoryPoints;
          
          let index = _.findIndex(state.activeAccomplishmentCards, (e) => e.label == payload.label);
          let newAccomplishment = GetAccomplishmentsByPerson(state.playerRole,1)[0];
    
          if(newAccomplishment !== undefined){
            state.activeAccomplishmentCards.splice(index,1,newAccomplishment);
          } else {
            state.activeAccomplishmentCards.splice(index,1);
          }
        }
      },
}