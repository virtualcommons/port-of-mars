import { Room } from 'colyseus.js';
import { WaitingResponses } from 'shared/waitingLobby/responses';
import { Schema } from '@colyseus/schema';
import { TStore } from '@/plugins/tstore';

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

export function applyWaitingServerResponses<T>(room: Room, store: TStore) {
  room.onMessage((msg: WaitingResponses) => {
    console.log('MESSAGE RECEIVED FROM SERVER!', msg);
    switch (msg.kind) {
      case 'client-joined-queue':
        const lobbyClientJoinedQueue: boolean = msg.value;
        store.commit('SET_LOBBY_CLIENT_JOINED_QUEUE', lobbyClientJoinedQueue);
        break;
      case 'send-invitation':
        const matchData: any = msg.matchData;
        const gameData: any = {
          roomId: matchData.room.roomId,
          sessionId: matchData.sessionId
        };
        // TODO: Temporary Implementation
        setGameData(gameData);
        store.commit('SET_LOBBY_RECEIVED_INVITATION', true);
        break;
      case 'client-remove-from-lobby':
        // TODO: HANDLE WAITING LOBBY DISCONNECT
        break;
      case 'waiting-lobby':
        break;
      case 'switch-rooms':
        break;
      default:
        break;
    }
  });

  room.state.onChange = (changes: Array<any>) => {
    changes.forEach(change => {
      console.log('WAITING LOBBY EVENT CHANGE: ', change);
      switch (change.field) {
        case 'lobbyNextAssignmentTime':
          const lobbyNextAssignmentTime: number = change.value;
          store.commit(
            'SET_LOBBY_NEXT_ASSIGNMENT_TIME',
            lobbyNextAssignmentTime
          );
          break;
        case 'lobbyWaitingUsers':
          const lobbyWaitingUsers: number = change.value;
          store.commit('SET_LOBBY_WAITING_USERS', lobbyWaitingUsers);
          break;
        default:
          break;
      }
    });
  };
}
