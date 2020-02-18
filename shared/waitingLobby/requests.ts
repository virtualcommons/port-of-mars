export interface AcceptInvitation {
  kind: 'accept-invitation';
  data?: any;
}

export interface SwitchRooms {
  kind: 'switch-rooms';
  room: string;
}

export type WaitingRequests = SwitchRooms | AcceptInvitation;
