import { Store } from 'vuex';
import { Room } from 'colyseus.js';
import {ChatMessageData, MarsEventData, Phase, PHASE_LABELS} from 'shared/types';
import { Responses } from 'shared/responses';

export function applyServerResponses<T>(room: Room, store: Store<T>) {
  room.onMessage((msg: Responses) => {
    switch (msg.kind) {
      case 'set-player-role': store.commit('SET_PLAYER_ROLE', msg.role); break;
      default: break;
    }
  });

  // eslint-disable-next-line no-param-reassign
  room.state.messages.onAdd = (msg: ChatMessageData, key: number) => {
    store.commit('ADD_TO_CHAT', msg);
  };

  room.state.marsEvents.onAdd = (e: MarsEventData) => {
    store.commit('ADD_TO_EVENTS', e);
  };

  room.state.marsEvents.onRemove = (index: number) => {
    store.commit('REMOVE_FROM_EVENTS', index);
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
      }
    })
  }
}
