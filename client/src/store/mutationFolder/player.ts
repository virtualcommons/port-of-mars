import {State} from "@/store/state";
import {AccomplishmentSetData, InvestmentData, Role} from "shared/types";
import {Vue} from "vue-property-decorator";

function SET_PLAYER_ROLE(state: State, payload: Role) {
  state.role = payload;
  console.log('PLAYER ROLE (MUTATION): ', state.role);
}
function SET_READINESS(state: State, payload: { data: boolean, role: Role }) {
  state.players[payload.role].ready = payload.data;
}
function SET_ACCOMPLISHMENTS(state: State, payload: { data: AccomplishmentSetData, role: Role }) {
  state.players[payload.role].accomplishment = payload.data;
}
function SET_VICTORY_POINTS(state: State, payload: { data: number, role: Role }) {
  state.players[payload.role].victoryPoints = payload.data;
}
function SET_PENDING_INVESTMENTS(state: State, payload: {data: InvestmentData, role: Role}) {
  Vue.set(state.players[payload.role], 'pendingInvestments', payload.data);
}

export default {
  SET_PLAYER_ROLE,
  SET_READINESS,
  SET_ACCOMPLISHMENTS,
  SET_VICTORY_POINTS,
  SET_PENDING_INVESTMENTS
}
