import { GameEvent } from "@port-of-mars/server/rooms/game/events/types";

export interface Command {
  execute(): Array<GameEvent>;
}