import * as _ from 'lodash';
import { State } from '@port-of-mars/shared/game/client/state';
import {AccomplishmentData, Resource, Role} from '@port-of-mars/shared/types';
import {Accomplishment} from "../../../../server/src/rooms/game/state";

export default {
  SET_ACTIVE_ACCOMPLISHMENTS(state: State, payload: { data: AccomplishmentData; role: Role }) {
    state.players[payload.role].accomplishments.purchasable.push(payload.data);
  },
  DISCARD_ACCOMPLISHMENT(state: State, payload: { id: number; role: Role }) {
    let index = _.findIndex(
      state.players[payload.role].accomplishments.purchasable,
      (e: AccomplishmentData) => e.id === payload.id
    );
    state.players[payload.role].accomplishments.purchasable.splice(index, 1);
  },
  PURCHASE_ACCOMPLISHMENT(state: State, payload: { data: AccomplishmentData; role: Role }) {
    state.players[payload.role].accomplishments.purchased.push(payload.data);
  },

  ADD_TO_PURCHASED_ACCOMPLISHMENTS(state: State, payload: { role: Role, data: AccomplishmentData }) {
    state.players[payload.role].accomplishments.purchased.push(payload.data);
  },

  REMOVE_FROM_PURCHASED_ACCOMPLISHMENTS(state: State, payload: { role: Role, data: AccomplishmentData}) {
    const purchased = state.players[payload.role].accomplishments.purchased;
    const index = purchased.findIndex((accomplishment: AccomplishmentData) => accomplishment.id === payload.data.id);
    purchased.splice(index);
  },

  ADD_TO_PURCHASABLE_ACCOMPLISHMENTS(state: State, payload: { role: Role, data: AccomplishmentData }) {
    state.players[payload.role].accomplishments.purchasable.push(payload.data);
  },

  REMOVE_FROM_PURCHASABLE_ACCOMPLISHMENTS(state: State, payload: { role: Role, data: AccomplishmentData }) {
    const purchasable = state.players[payload.role].accomplishments.purchasable;
    const index = purchasable.findIndex((accomplishment: AccomplishmentData) => accomplishment.id === payload.data.id);
    purchasable.splice(index, 1);
  }
};
