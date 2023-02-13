import { GameState } from "@port-of-mars/server/rooms/game/state";
import { Role, ServerRole } from "@port-of-mars/shared/types";
import { Responses } from "@port-of-mars/shared/game/responses";

export type Json = boolean | null | number | string | { [property: string]: Json } | Json[];

export interface GameEvent {
  apply(game: GameState): void | Responses;
  serialize(): { type: string; payload: object };
  getRole?(game: GameState): Role | ServerRole;
}
