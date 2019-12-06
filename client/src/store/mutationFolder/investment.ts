import {BaseInvestmentCosts} from '@/models';
import {State} from "@/store/state";
import {Resource, ResourceCostData, Role} from "shared/types";

export default {
  SET_INVESTMENT_AMOUNT(state: State, payload: { resource: Resource, units: number, role: Role }) {
    // this is for increment and decrement
    state.players[payload.role].pendingInvestments[payload.resource] = payload.units;
  },
  SET_INVESTMENT_COSTS(state: State, payload: { costs: ResourceCostData, role: Role}) {
    state.players[payload.role].costs = payload.costs;
  }
}
