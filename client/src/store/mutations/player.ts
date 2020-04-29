import { State } from "@port-of-mars/client/store/state";
import {
  AccomplishmentSetData,
  InvestmentData,
  INVESTMENTS,
  Role
} from "@port-of-mars/shared/types";
import { Vue } from "vue-property-decorator";

function SET_PLAYER_ROLE(state: State, payload: Role) {
  state.role = payload;
}

function UPDATE_PLAYER_ROLE(state: State, payload: {data: Role, role: Role}) {
  state.players[payload.role].role = payload.role;
}

function SET_READINESS(state: State, payload: { data: boolean; role: Role }) {
  state.players[payload.role].ready = payload.data;
}

function SET_ACCOMPLISHMENTS(state: State, payload: { data: AccomplishmentSetData; role: Role }) {
  const p = state.players[payload.role];
  Vue.set(p.accomplishments, "purchasable", payload.data.purchasable);
  Vue.set(p.accomplishments, "purchased", payload.data.purchased);
}

function SET_VICTORY_POINTS(state: State, payload: { data: number; role: Role }) {
  state.players[payload.role].victoryPoints = payload.data;
}

function SET_PENDING_INVESTMENTS(state: State, payload: { data: InvestmentData; role: Role }) {
  for (const investment of INVESTMENTS) {
    state.players[payload.role].pendingInvestments[investment] = payload.data[investment];
  }
}

function SET_CONTRIBUTED_UPKEEP(state: State, payload: { data: number; role: Role }) {
  const p = state.players[payload.role];
  p.contributedUpkeep = payload.data;
}

export default {
  SET_PLAYER_ROLE,
  UPDATE_PLAYER_ROLE,
  SET_READINESS,
  SET_ACCOMPLISHMENTS,
  SET_VICTORY_POINTS,
  SET_PENDING_INVESTMENTS,
  SET_CONTRIBUTED_UPKEEP
};
