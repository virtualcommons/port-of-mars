import {MarsEventData} from "shared/types";
import * as _ from "lodash";
import {GameState} from "@port-of-mars/server/rooms/game/state";


export interface MarsEventStateConstructor {
  new(data?: any): MarsEventState
}

export interface MarsEventState {
  finalize(game: GameState): void
  initialize?(game:GameState): void;

  toJSON(): any
}

export const expandCopies = (marsEventsCollection: Array<[MarsEventData, number]>) =>
  _.flatMap(marsEventsCollection, ([event, copies]: [MarsEventData, number]) => {
    return _.map(_.range(copies), i => _.cloneDeep(event));
  });

export const getEventName = (cls: {new(): any} | Function) => _.camelCase(cls.name);