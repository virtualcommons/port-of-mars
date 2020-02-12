import {MarsEventData} from "shared/types";
import * as _ from "lodash";
import {GameState} from "@/rooms/game/state";


export interface MarsEventStateConstructor {
  new(data?: any): MarsEventState
}

export interface MarsEventState {
  finalize(game: GameState): void

  toJSON(): any
}

export const expandCopies = (marsEventsCollection: Array<[MarsEventData, number]>) =>
  _.flatMap(marsEventsCollection, ([event, copies]: [MarsEventData, number]) => {
    return _.map(_.range(copies), i => _.cloneDeep(event));
  });