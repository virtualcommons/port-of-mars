import {GameState} from "@port-of-mars/server/rooms/game/state";

export interface GameEvent {
  apply(game: GameState): void
  serialize(): { kind: string, data?: object }
}