import { Room } from 'colyseus.js';
import { WaitingResponses } from '@port-of-mars/shared/lobby/responses';
import { GAME_PAGE, LOGIN_PAGE } from '@port-of-mars/shared/routes';
import WaitingLobby from '@port-of-mars/client/views/WaitingLobby.vue';

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
  component: WaitingLobby
) {
  const store = component.$tstore;
  const router = component.$router;
  room.onError((message: string) => {
    console.log('Error occurred in room..');
    console.log(message);
    // alert("sorry, we encountered an error, please try refreshing the page or contact us");
  });

  room.onLeave((code: number) => {
    console.log(`client left the room: ${code}`);
  });

  room.onMessage((msg: WaitingResponses) => {
    switch (msg.kind) {
      case 'joined-client-queue':
        (component as any).joinedQueue = msg.value;
        break;
      case 'sent-invitation':
        // store reservation details in ajax local storage
        component.$ajax.roomId = msg.roomId;
        router.push({ name: GAME_PAGE });
        room.send({ kind: 'accept-invitation' });
        break;
      case 'removed-client-from-lobby':
        // TODO: HANDLE WAITING LOBBY DISCONNECT
        break;
    }
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
