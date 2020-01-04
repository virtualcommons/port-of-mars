import { State } from '@/store/state';
import {
  Investment,
  InvestmentData,
  Resource,
  ResourceCostData,
  RESOURCES,
  Role
} from 'shared/types';
import { Vue } from 'vue-property-decorator';

export default {
  SET_PENDING_INVESTMENT_AMOUNT(
    state: State,
    payload: { investment: Investment; units: number; role: Role }
  ) {
    state.players[payload.role].pendingInvestments[payload.investment] = payload.units;
  },
  SET_INVESTMENT_COSTS(state: State, payload: { data: ResourceCostData; role: Role }) {
    state.players[payload.role].costs = payload.data;
  },
  SET_INVENTORY(state: State, payload: { data: InvestmentData; role: Role }) {
    for (const resource of RESOURCES) {
      state.players[payload.role].inventory[resource] = payload.data[resource];
    }
  },
  SET_TIME_BLOCKS(state: State, payload: { data: number; role: Role }) {
    state.players[payload.role].timeBlocks = payload.data;
  }
};
