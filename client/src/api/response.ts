import { Store } from 'vuex';
import { Room } from 'colyseus.js';
import { ChatMessageData } from 'shared/types';
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
}
