import { MarsEventData, MarsEventOverride } from "@port-of-mars/shared/types";
import _ from "lodash";
import { GameState } from "@port-of-mars/server/rooms/game/state";
import { MarsEventDeckItem, getDefaultMarsEventDeck } from "@port-of-mars/server/data/MarsEvents";

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

/**
 * Get a fixed (unshuffled) mars event deck with the given overrides
 */
export function getFixedMarsEventDeck(
  eventOverrides?: MarsEventOverride[] | null
): Array<MarsEventData> {
  const deck = getDefaultMarsEventDeck();
  if (eventOverrides) {
    for (const override of eventOverrides) {
      const index = deck.findIndex(item => item.event.id === override.eventId);
      if (index !== -1) {
        deck[index].numberOfCopies = override.quantity;
      }
    }
  }
  return _.clone(expandCopies(deck));
}

export function getRandomizedMarsEventDeck(
  eventOverrides: MarsEventOverride[] | null
): Array<MarsEventData> {
  return _.shuffle(getFixedMarsEventDeck(eventOverrides));
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const getEventName = (cls: { new (): any } | Function) => _.camelCase(cls.name);
