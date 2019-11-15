export interface SetPlayerRole {
    kind: 'set-player-role'
    role: string
}

export interface SetError {
    kind: 'error'
    message: string
}

export type Responses = SetPlayerRole | SetError;