///NICK CHANGES
export interface WaitingLobby{
    kind: 'waiting-lobby'
    message:string
}

export interface SwitchRooms{
    kind: 'switch-rooms'
    message:string
}

export type WaitingResponses = WaitingLobby | SwitchRooms;