import {GameEvent} from "@/events/types";
import {Game} from "@/rooms/types";

export interface Command {
  execute(): Array<GameEvent>
}