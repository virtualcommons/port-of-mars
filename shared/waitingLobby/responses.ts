///NICK CHANGES
export interface WaitingLobby{
    kind: 'waiting-lobby'
    message:string
}

export interface SwitchRooms{
    kind: 'switch-rooms'
    room:string
}

export type WaitingResponses = WaitingLobby | SwitchRooms;