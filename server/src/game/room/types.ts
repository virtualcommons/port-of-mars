import {Client, Room} from "colyseus";
import {GameState, Player} from "@/game/state";
import {Responses} from "shared/responses";
import {Role} from "shared/types";
import {GameEvent} from "@/game/events/types";

export type PlayerReadiness = { [role in Role]: boolean }

export interface Game extends Room<GameState> {
  safeSend(client: Client, msg: Responses): void

  getPlayerByClient(client: Client): Player

  getLeftPhaseEvent(): GameEvent | undefined
}