import { Room } from 'colyseus.js';

import { WaitingResponses } from 'shared/waitingLobby/responses';
import { Schema } from '@colyseus/schema';
import { TStore } from '@/plugins/tstore';

export function applyWaitingServerResponses<T>(room: Room, store: TStore) {
  room.onMessage((msg: WaitingResponses) => {
    switch (msg.kind) {
      case 'waiting-lobby':
        break;
      case 'switch-rooms':
        break;
      default:
        break;
    }
  });
}
