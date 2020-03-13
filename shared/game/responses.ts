import {Role} from "../types";

export interface SetPlayerRole {
    kind: 'set-player-role'
    role: Role
}

export interface SetError {
    kind: 'error'
    message: string
}


export type Responses = SetPlayerRole | SetError;