import {GameEvent} from "@/game/events/types";
import {Game} from "@/game/room/types";

export interface Command {
  execute(): Array<GameEvent>
}