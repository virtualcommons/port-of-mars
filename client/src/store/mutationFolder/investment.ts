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

