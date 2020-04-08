import { GameSerialized, GameState } from "@port-of-mars/server/rooms/game/state";
import { mockGameStateInitOpts } from "@port-of-mars/server/util";
import { GameEvent } from "@port-of-mars/server/entity";
import { gameEventDeserializer } from "@port-of-mars/server/rooms/game/events";
import _ from "lodash";

function loadSnapshot(data: GameSerialized): GameState {
  const g = new GameState(mockGameStateInitOpts());
  g.fromJSON(data);
  return g;
}

export class GameReplayer {
  constructor(public events: Array<GameEvent>) { }

  summarize<T>(summarizer: (g: GameState) => T): Array<T> {
    const g = loadSnapshot(this.events[0].payload as GameSerialized);
    const summaries: Array<T> = [];
    let timeToNextTransition = g.timeRemaining;
    for (const event of this.events.slice(1)) {
      const summary = summarizer(g);
      const phase = g.phase;
      const e = gameEventDeserializer.deserialize(event);
      g.applyMany([e]);
      if (!_.isEqual(phase, g.phase)) {
        summaries.push({ ...summary, duration: timeToNextTransition - event.timeRemaining });
        timeToNextTransition = g.timeRemaining;
      }
    }
    summaries.push({ ...summarizer(g), duration: 0 });
    return summaries;
  }
}