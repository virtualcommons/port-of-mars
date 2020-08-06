import { Room } from 'colyseus.js';
import {
  JoinedClientQueue,
  SentInvitation,
  RemovedClientFromLobby,
} from '@port-of-mars/shared/lobby/responses';
import { GAME_PAGE } from '@port-of-mars/shared/routes';
import Lobby from '@port-of-mars/client/views/Lobby.vue';

// TODO: Temporary Implementation
const GAME_DATA = 'gameData';
interface GameData {
  roomId: string;
  sessionId: string;
}

// TODO: Temporary Implementation
function setGameData(data: GameData) {
  localStorage.setItem(GAME_DATA, JSON.stringify(data));
}

export function applyWaitingServerResponses<T>(
  room: Room,
  component: Lobby
) {
  const store = component.$tstore;
  const router = component.$router;
  room.onError((code: number, message?: string) => {
    console.log(`Error ${code} occurred in room: ${message} `);
    alert(
      'sorry, we encountered an error, please try refreshing the page or contact us'
    );
  });

  room.onLeave((code: number) => {
    console.log(`client left the room: ${code}`);
  });

  room.onMessage('joined-client-queue', (msg: JoinedClientQueue) => {
    (component as any).joinedQueue = msg.value;
  });
  room.onMessage('sent-invitation', (msg: SentInvitation) => {
    component.$ajax.roomId = msg.roomId;
    router.push({ name: GAME_PAGE });
    room.send('accept-invitation', { kind: 'accept-invitation' });
  });
  room.onMessage('removed-client-from-lobby', (msg: RemovedClientFromLobby) => {
    // TODO: HANDLE WAITING LOBBY DISCONNECT
    console.log('Removed client from lobby (currently a NO-OP).');
  });

  room.state.onChange = (changes: Array<any>) => {
    changes.forEach((change) => {
      switch (change.field) {
        case 'nextAssignmentTime':
          (component as any).nextAssignmentTime = change.value;
          break;
        case 'waitingUserCount':
          (component as any).waitingUserCount = change.value;
          break;
      }
    });
  };
}
