import {GameState} from "@/game/state";

export interface GameEvent {
  dateCreated: number
  apply(game: GameState): void
  serialize(): { kind: string, data?: object, dateCreated: number }
}