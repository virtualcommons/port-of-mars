export interface AcceptInvitation {
  kind: 'accept-invitation';
  data?: any;
}

export interface StartWithBots {
  kind: 'start-with-bots';
  data?: any;
}

export interface VoteStartWithBots {
  kind: 'vote-start-with-bots';
  value: boolean;
}

export interface SendLobbyChatMessage {
  kind: 'send-lobby-chat-message';
  value: string;
}

export interface StartSoloWithBots {
  kind: 'start-solo-with-bots';
  data?: any;
}

export type LobbyRequest =
  | AcceptInvitation
  | StartWithBots
  | VoteStartWithBots
  | SendLobbyChatMessage
  | StartSoloWithBots;
