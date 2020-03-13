export interface AcceptInvitation {
  kind: 'accept-invitation';
  data?: any;
}

export interface DistributeGroups {
  kind: 'distribute-groups';
}

export type WaitingRequests = AcceptInvitation | DistributeGroups;
