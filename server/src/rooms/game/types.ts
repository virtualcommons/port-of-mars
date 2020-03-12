import {Client, Room} from "colyseus";
import {GameState, Player} from "@/rooms/game/state";
import {Responses} from "shared/responses";
import {MarsEventData, Role} from "shared/types";
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
  initialize(options: GameOpts, roomId: string): Promise<number>
  applyMany(gameId: number, events: Array<ge.GameEvent>): void
  sync(): Promise<void>
}

export interface GameOpts extends GameStateOpts {
  persister: Persister
  tournamentRoundId: number
}

export interface GameStateOpts {
  userRoles: { [username: string]: Role }
  deck: Array<MarsEventData>
  round: number
}