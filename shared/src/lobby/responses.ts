///NICK CHANGES
export interface JoinedClientQueue {
  kind: 'joined-client-queue';
  value: boolean;
}

export interface SentInvitation {
  kind: 'sent-invitation';
  reservation: object;
}

export interface RemovedClientFromLobby {
  kind: 'removed-client-from-lobby';
  data?: any;
}

export type WaitingResponses =
  | JoinedClientQueue
  | SentInvitation
  | RemovedClientFromLobby;
