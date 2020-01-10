import { Room } from 'colyseus.js';

import { clientRunner } from '@/main';

import { WaitingResponses } from 'shared/waitingLobby/responses';
import { Schema } from '@colyseus/schema';
import { TStore } from 'vue/types/vue';

type Schemify<T> = T & Schema;

async function switchRooms(room: string) {
  clientRunner(room);
}

export function applyWaitingServerResponses<T>(room: Room, store: TStore) {
  room.onMessage((msg: WaitingResponses) => {
    switch (msg.kind) {
      case 'waiting-lobby':
        break;
      case 'switch-rooms':
        switchRooms(msg.room);
        break;
      default:
        break;
    }
  });
}
