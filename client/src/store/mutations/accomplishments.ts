import * as _ from 'lodash';
import { State } from '@port-of-mars/shared/game/client/state';
import { getRole } from '@port-of-mars/client/store/mutations/util';
import { AccomplishmentData, Role } from '@port-of-mars/shared/types';

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
  }
};
