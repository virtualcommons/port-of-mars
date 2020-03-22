import { Room } from 'colyseus.js';
import { WaitingResponses } from '@port-of-mars/shared/lobby/responses';
import { GAME_PAGE, LOGIN_PAGE } from "@port-of-mars/shared/routes";
import WaitingLobby from "@port-of-mars/client/views/WaitingLobby.vue";

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

export function applyWaitingServerResponses<T>(room: Room, component: WaitingLobby) {
  const store = component.$tstore;
  const router = component.$router;
  room.onMessage((msg: WaitingResponses) => {
    console.log('MESSAGE RECEIVED FROM SERVER!', msg);
    switch (msg.kind) {
      case 'joined-client-queue':
        (component as any).joinedQueue = msg.value;
        break;
      case 'sent-invitation':
        const reservation: any = msg.reservation;
        component.$ajax.reservation = reservation;
        router.push({ name: GAME_PAGE });
        room.send({ kind: 'accept-invitation' });
        break;
      case 'removed-client-from-lobby':
        // TODO: HANDLE WAITING LOBBY DISCONNECT
        break;
    }
  });

  room.state.onChange = (changes: Array<any>) => {
    changes.forEach(change => {
      console.log('WAITING LOBBY EVENT CHANGE: ', change);
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
