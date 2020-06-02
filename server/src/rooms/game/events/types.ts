import {GameState} from "@port-of-mars/server/rooms/game/state";
import {GameRoom} from "@port-of-mars/server/rooms/game";
import {Role, ServerRole} from "@port-of-mars/shared/types";

export type Json = boolean | null | number | string | { [property: string]: Json } | Json[];

export interface GameEvent {
  apply(game: GameState): void;
  serialize(): { type: string; payload: object };
  getRole?(game: GameState): Role | ServerRole;
}