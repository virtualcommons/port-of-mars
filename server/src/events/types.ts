import {GameState} from "@/state";

export interface GameEvent {
  apply(game: GameState): void
}