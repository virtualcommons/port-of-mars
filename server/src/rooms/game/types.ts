import { Client, Room } from "colyseus";
import { GameState, Player } from "@port-of-mars/server/rooms/game/state";
import { Responses } from "@port-of-mars/shared/game/responses";
import { MarsEventData, Role } from "@port-of-mars/shared/types";
import * as ge from "@port-of-mars/server/rooms/game/events/types";
import { GameEvent } from "@port-of-mars/server/entity/GameEvent";

export type PlayerReadiness = { [role in Role]: boolean }

export interface Game extends Room<GameState> {
  safeSend(client: Client, msg: Responses): void

  getPlayerByClient(client: Client): Player
}

export interface PersistenceAPIConstructor {
  new(connection: any): Persister
}

export interface Persister {
  initialize(options: GameOpts, roomId: string): Promise<number>
  applyMany(events: Array<ge.GameEvent>, metadata: Metadata): void
  sync(): Promise<void>
}

export interface GameOpts extends GameStateOpts {
  persister: Persister
  tournamentRoundId: number
}

export interface GameStateOpts {
  userRoles: { [username: string]: Role }
  deck: Array<MarsEventData>
  numberOfGameRounds: number
}

export type Metadata = Pick<GameEvent, 'dateCreated' | 'timeRemaining' | 'gameId'>