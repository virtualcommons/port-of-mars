import { Store } from 'vuex';
import { Room } from 'colyseus.js';
import {ChatMessageData, MarsEventData, Phase, PHASE_LABELS} from 'shared/types';
import { Responses } from 'shared/responses';
import {Schema} from "@colyseus/schema";

type Schemify<T> = T & Schema

export function applyServerResponses<T>(room: Room, store: Store<T>) {
  room.onMessage((msg: Responses) => {
    switch (msg.kind) {
      case 'set-player-role': store.commit('SET_PLAYER_ROLE', msg.role); break;
      default: break;
    }
  });

  // eslint-disable-next-line no-param-reassign
  room.state.messages.onAdd = (msg: Schemify<ChatMessageData>, key: number) => {
    store.commit('ADD_TO_CHAT', msg.toJSON());
  };

  room.state.marsEvents.onAdd = (e: Schemify<MarsEventData>, index: number) => {
    store.commit('ADD_TO_EVENTS', e.toJSON());
  };

  room.state.marsEvents.onRemove = (e: Schemify<MarsEventData>, index: number) => {
    store.commit('REMOVE_FROM_EVENTS', e.id);
  };

  room.state.marsEvents.onChange = (event: Schemify<MarsEventData>, index: number) => {
    store.commit('CHANGE_EVENT', {event: event.toJSON(), index});
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
