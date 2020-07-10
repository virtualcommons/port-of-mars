import { Client, Room } from "colyseus";
import { GameState, Player } from "@port-of-mars/server/rooms/game/state";
import { Responses } from "@port-of-mars/shared/game/responses";
import { MarsEventData, Role } from "@port-of-mars/shared/types";
import * as ge from "@port-of-mars/server/rooms/game/events/types";
import { GameEvent } from "@port-of-mars/server/entity/GameEvent";
import * as entity from "@port-of-mars/server/entity";

export type PlayerReadiness = { [role in Role]: boolean }

export interface Game extends Room<GameState> {
  safeSend(client: Client, msg: Responses): void;
  getPlayer(client: Client): Player;
}

export interface PersistenceAPIConstructor {
  new(connection: any): Persister;
}

export interface Persister {
  initialize(options: GameOpts, roomId: string, shouldCreatePlayers: boolean): Promise<number>;
  finalize(gameId: number, shouldFinalizePlayers: boolean): Promise<any>;
  persist(events: Array<ge.GameEvent>, metadata: Metadata): void;
  sync(): Promise<void>;
}

export interface GameOpts extends GameStateOpts {
  tournamentRoundId: number;
}

export interface GameStateOpts {
  userRoles: { [username: string]: Role };
  deck: Array<MarsEventData>;
  numberOfGameRounds: number;
}

export type Metadata = Pick<GameEvent, 'dateCreated' | 'timeRemaining' | 'gameId'>