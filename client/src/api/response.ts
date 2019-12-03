import { Store } from 'vuex';
import { Room } from 'colyseus.js';
import {ChatMessageData, MarsEventData, Phase, PHASE_LABELS} from 'shared/types';
import { Responses } from 'shared/responses';
import {Schema} from "@colyseus/schema";
import {TStore} from "vue/types/vue";

type Schemify<T> = T & Schema

function deschemify<T>(s: Schemify<T>): T {
  return (s.toJSON() as T);
}

export function applyServerResponses<T>(room: Room, store: TStore) {
  room.onMessage((msg: Responses) => {
    switch (msg.kind) {
      case 'set-player-role': store.commit('SET_PLAYER_ROLE', msg.role); break;
      default: break;
    }
  });

  // eslint-disable-next-line no-param-reassign
  room.state.messages.onAdd = (msg: Schemify<ChatMessageData>, key: number) => {
    store.commit('ADD_TO_CHAT', deschemify(msg));
  };

  room.state.messages.onRemove = (msg: Schemify<ChatMessageData>, index: number) => {
    store.commit('REMOVE_FROM_CHAT', deschemify(msg));
  };

  room.state.marsEvents.onAdd = (e: Schemify<MarsEventData>, index: number) => {
    store.commit('ADD_TO_EVENTS', deschemify(e));
  };

  room.state.marsEvents.onRemove = (e: Schemify<MarsEventData>, index: number) => {
    store.commit('REMOVE_FROM_EVENTS', deschemify(e));
  };

  room.state.marsEvents.onChange = (event: Schemify<MarsEventData>, index: number) => {
    store.commit('CHANGE_EVENT', {event: deschemify(event), index});
  };

  room.state.onChange = (changes: Array<any>) => {
    changes.forEach(change => {
      if (change.field === 'phase') {
        const phase: Phase = change.value;
        store.commit('SET_GAME_PHASE', PHASE_LABELS[phase]);
      }
      if (change.field === 'round') {
        const round: number = change.value;
        store.commit('SET_ROUND', round);
      }
      if (change.field === 'upkeep') {
        const upkeep: number = change.value;
        store.commit('SET_UPKEEP', upkeep);
        if(upkeep < 100) {
          store.commit('ADD_TO_MARS_LOG','upkeep has dropped by 25!');
        }
      }
    })
  }
}
