import { GetAccomplishmentsByPerson, buyAccomplishment } from '@/models';
import { Accomplishment } from '@/models/AccomplishmentsModels';
import * as _ from 'lodash';
import {State} from "@/store/state";
import {getRole} from "@/store/mutationFolder/util";
import {AccomplishmentData, Role} from "shared/types";

export default {
  SET_ACTIVE_ACCOMPLISHMENTS(state: State, payload: { data: AccomplishmentData, role: Role}) {
    state.players[payload.role].accomplishment.purchasable.push(payload.data);
  },
  DISCARD_ACCOMPLISHMENT(state: State, payload: { id: number, role: Role}) {
    let index = _.findIndex(
      state.players[payload.role].accomplishment.purchasable,
      (e: AccomplishmentData) => e.id === payload.id
    );
    state.players[payload.role].accomplishment.purchasable.splice(index, 1);
  },
  PURCHASE_ACCOMPLISHMENT(state: State, payload: { data: AccomplishmentData, role: Role }) {
    state.players[payload.role].accomplishment.bought.push(payload.data);
  }
};
