import {GameEvent} from "@port-of-mars/server/rooms/game/events/types";
import {Game} from "@port-of-mars/server/rooms/game/types";

export interface Command {
  execute(): Array<GameEvent>;
}