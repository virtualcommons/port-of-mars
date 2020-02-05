import {GameEvent} from "@/rooms/game/events/types";
import {Game} from "@/rooms/game/types";

export interface Command {
  execute(): Array<GameEvent>
}