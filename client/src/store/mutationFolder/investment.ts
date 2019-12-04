<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> [refactor] investment data sends to server
import { BaseInvestmentCosts } from '@/models';
import {State} from "@/store/state";
export default {
    CHANGE_LOCAL_INVESTMENT(state: State, payload: any) {
        // this is for increment and decrement
        state.localInvestments.changeInventoryValue(payload.investmentName, payload.investmentAmount);
      },
    SET_PLAYER_INVESTMENT_COSTS(state: State, payload: string){
      Object.keys(BaseInvestmentCosts[payload]).forEach(key => {
        state.localInvestments.updateCurrentCost(key, BaseInvestmentCosts[payload][key]);
      });
    }
}
=======
export default {
    CHANGE_LOCAL_INVESTMENT(state: any, payload: any) {
        // this is for increment and decrement
        state.localInvestments.changeInventoryValue(payload.investmentName, payload.investmentAmount);
      },
}
>>>>>>> [refactor] store is modular
