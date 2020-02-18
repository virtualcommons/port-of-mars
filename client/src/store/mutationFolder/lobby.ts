import { State } from '@/store/state';

function SET_LOBBY_NEXT_ASSIGNMENT_TIME(state: State, payload: number) {
  state.lobbyNextAssignmentTime = payload;
}

function SET_LOBBY_WAITING_USERS(state: State, payload: number) {
  state.lobbyWaitingUsers = payload;
}

function SET_LOBBY_CLIENT_JOINED_QUEUE(state: State, payload: boolean) {
  state.lobbyClientJoinedQueue = payload;
}

function SET_LOBBY_RECEIVED_INVITATION(state: State, payload: boolean) {
  state.lobbyReceivedInvitation = payload;
}

export default {
  SET_LOBBY_NEXT_ASSIGNMENT_TIME,
  SET_LOBBY_WAITING_USERS,
  SET_LOBBY_CLIENT_JOINED_QUEUE,
  SET_LOBBY_RECEIVED_INVITATION
};
