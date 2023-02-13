import { MarsEventData } from "@port-of-mars/shared/types";
import _ from "lodash";
import { GameState } from "@port-of-mars/server/rooms/game/state";
import { MarsEventDeckItem, getMarsEventDeckItems } from "@port-of-mars/server/data/MarsEvents";

export interface MarsEventStateConstructor {
  new (data?: any): MarsEventState;
}

export interface MarsEventState {
  finalize(game: GameState): void;
  initialize?(game: GameState): void;

  toJSON(): any;
}

export function expandCopies(marsEventsCollection: Array<MarsEventDeckItem>): Array<MarsEventData> {
  return _.flatMap(marsEventsCollection, (eventItem: MarsEventDeckItem) =>
    _.map(_.range(eventItem.numberOfCopies), () => _.cloneDeep(eventItem.event))
  );
}

export function getFixedMarsEventDeck(): Array<MarsEventData> {
  return _.clone(expandCopies(getMarsEventDeckItems()));
}

export function getRandomizedMarsEventDeck(): Array<MarsEventData> {
  return _.shuffle(getFixedMarsEventDeck());
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const getEventName = (cls: { new (): any } | Function) => _.camelCase(cls.name);
