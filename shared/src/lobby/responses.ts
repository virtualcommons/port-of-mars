export interface JoinedClientQueue {
  kind: "joined-client-queue";
  value: boolean;
}

export interface JoinExistingGame {
  kind: "join-existing-game";
}

export interface SentInvitation {
  kind: "sent-invitation";
  roomId: string;
}

export interface RemovedClientFromLobby {
  kind: "removed-client-from-lobby";
  data?: any;
}

export interface JoinFailure {
  kind: "join-failure";
  reason: string;
}

export interface SetGroupSize {
  kind: "set-group-size";
  groupSize: number;
}

export type LobbyResponse =
  | JoinedClientQueue
  | JoinExistingGame
  | SentInvitation
  | RemovedClientFromLobby
  | JoinFailure
  | SetGroupSize;
