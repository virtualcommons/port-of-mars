import { State } from "@port-of-mars/shared/game/client/state";
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

function SET_USERNAME(state: State, payload: { data: string; role: Role }) {
  state.players[payload.role].username = payload.data;
}

function SET_COMPULSIVE_PHILANTHROPIST(state: State, payload: { data: boolean; role: Role }) {
  state.players[payload.role].isCompulsivePhilanthropist = payload.data;
}

function SET_IS_MUTED(state: State, payload: { data: boolean; role: Role }) {
  state.players[payload.role].isMuted = payload.data;
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

function SET_BOT_WARNING(state: State, payload: { data: boolean, role: Role }) {
  state.players[payload.role].botWarning = payload.data;
}

function SET_BOT_STATUS(state: State, payload: { data: boolean, role: Role }) {
  state.players[payload.role].isBot = payload.data;
}

export default {
  SET_PLAYER_ROLE,
  SET_USERNAME,
  SET_COMPULSIVE_PHILANTHROPIST,
  SET_READINESS,
  SET_BOT_WARNING,
  SET_BOT_STATUS,
  SET_ACCOMPLISHMENTS,
  SET_VICTORY_POINTS,
  SET_PENDING_INVESTMENTS,
  SET_IS_MUTED,
};
