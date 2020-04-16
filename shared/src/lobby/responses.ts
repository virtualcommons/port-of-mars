export interface JoinedClientQueue {
  kind: 'joined-client-queue';
  value: boolean;
}

export interface SentInvitation {
  kind: 'sent-invitation';
  roomId: string;
}

export interface RemovedClientFromLobby {
  kind: 'removed-client-from-lobby';
  data?: any;
}

export interface JoinFailure {
  kind: 'join-failure'
  reason: string
}

export type WaitingResponses =
  | JoinedClientQueue
  | SentInvitation
  | RemovedClientFromLobby
  | JoinFailure;
