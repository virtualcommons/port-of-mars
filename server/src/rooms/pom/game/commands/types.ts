import { GameEvent } from "@port-of-mars/server/rooms/pom/game/events/types";

export interface Command {
  execute(): Array<GameEvent>;
}
