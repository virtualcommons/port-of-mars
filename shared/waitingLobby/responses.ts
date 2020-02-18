///NICK CHANGES
export interface ClientJoinedQueue {
  kind: 'client-joined-queue';
  value: boolean;
}

export interface SendInvitation {
  kind: 'send-invitation';
  matchData: object;
}

export interface ClientRemoveFromLobby {
  kind: 'client-remove-from-lobby';
  data?: any;
}

export interface WaitingLobby {
  kind: 'waiting-lobby';
  message: string;
}

export interface SwitchRooms {
  kind: 'switch-rooms';
  room: string;
}

export type WaitingResponses =
  | ClientJoinedQueue
  | SendInvitation
  | ClientRemoveFromLobby
  | WaitingLobby
  | SwitchRooms;
