import {Client, Room} from "colyseus";
import {GameState, Player} from "@/rooms/game/state";
import {Responses} from "shared/responses";
import {Role} from "shared/types";
import * as ge from "@/rooms/game/events/types";

export type PlayerReadiness = { [role in Role]: boolean }

export interface Game extends Room<GameState> {
  safeSend(client: Client, msg: Responses): void

  getPlayerByClient(client: Client): Player
}

export interface PersistenceAPIConstructor {
  new (connection: any): Persister
}

export interface Persister {
  initialize(options: GameOpts): Promise<number>
  applyMany(gameId: number, events: Array<ge.GameEvent>): void
  sync(): Promise<void>
}

export type GameOpts = {
  persister: Persister,
  userRoles: { [username: string]: Role }
  tournamentId: number
}