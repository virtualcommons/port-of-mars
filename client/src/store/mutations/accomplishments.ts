import * as _ from 'lodash';
import { State } from '@port-of-mars/shared/game/client/state';
import {AccomplishmentData, Role} from '@port-of-mars/shared/types';

export default {
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
    if (index === -1) {
      console.log("Couldn't remove purchased accomplishment: ", payload.data);
      return;
    }
    purchased.splice(index, 1);
  },

  ADD_TO_PURCHASABLE_ACCOMPLISHMENTS(state: State, payload: { role: Role, data: AccomplishmentData }) {
    state.players[payload.role].accomplishments.purchasable.push(payload.data);
  },

  REMOVE_FROM_PURCHASABLE_ACCOMPLISHMENTS(state: State, payload: { role: Role, data: AccomplishmentData }) {
    const purchasable = state.players[payload.role].accomplishments.purchasable;
    const index = purchasable.findIndex((accomplishment: AccomplishmentData) => accomplishment.id === payload.data.id);
    if (index === -1) {
      console.log("Couldn't remove purchasable accomplishment: ", payload.data);
      return;
    }
    purchasable.splice(index, 1);
  }
};
