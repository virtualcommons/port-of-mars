import {GameSerialized, GameState} from "@port-of-mars/server/rooms/game/state";
import {mockGameStateInitOpts} from "@port-of-mars/server/util";
import {GameEvent} from "@port-of-mars/server/entity/GameEvent";
import {gameEventDeserializer} from "@port-of-mars/server/rooms/game/events";
import _ from "lodash";

function loadSnapshot(data: GameSerialized): GameState {
  const g = new GameState(mockGameStateInitOpts());
  g.fromJSON(data);
  return g;
}

export class GameReplayer {
  constructor(public events: Array<GameEvent>) {}

  summarize<T>(summarizer: (g: GameState) => T, iterState: (g: GameState) => any): Array<T> {
    const g = loadSnapshot(this.events[0].payload as GameSerialized);
    const summary: Array<T> = [summarizer((g))];
    for (const event of this.events.slice(1)) {
      const s1 = iterState(g);
      const e = gameEventDeserializer.deserialize(event);
      g.applyMany([e]);
      const s2 = iterState(g);
      if (!_.isEqual(s1, s2)) {
        summary.push(summarizer(g))
      }
    }
    return summary;
  }
}