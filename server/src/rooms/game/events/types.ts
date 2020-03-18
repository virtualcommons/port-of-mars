import {GameState} from "@port-of-mars/server/rooms/game/state";

export interface GameEvent {
  dateCreated: number
  apply(game: GameState): void
  serialize(): { kind: string, data?: object, dateCreated: number, timeRemaining: number }
}