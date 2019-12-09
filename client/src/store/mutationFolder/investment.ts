import {BaseInvestmentCosts} from '@/models';
import {State} from "@/store/state";
import {Investment, Resource, ResourceCostData, Role} from "shared/types";

export default {
  SET_INVESTMENT_AMOUNT(state: State, payload: { investment: Investment, units: number, role: Role }) {
    console.log(payload);
    state.players[payload.role].pendingInvestments[payload.investment] = payload.units;
  },
  SET_INVESTMENT_COSTS(state: State, payload: { costs: ResourceCostData, role: Role}) {
    state.players[payload.role].costs = payload.costs;
  }
}

