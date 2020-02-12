import {
  MarsEventState,
  MarsEventStateConstructor,
} from "@/rooms/game/state/marsEvents/common";
import {GameState} from "@/rooms/game/state";
import * as _ from "lodash";
import {CURATOR, ENTREPRENEUR, PIONEER, POLITICIAN, RESEARCHER, Role, ROLES} from "shared/types";

export type PersonalGainData = { [role in Role]: boolean };

const _dispatch: { [id: string]: MarsEventStateConstructor } = {};

export function assocEventId(constructor: MarsEventStateConstructor) {
  _dispatch[_.camelCase(constructor.name)] = constructor;
}

export function constructState(id: string) {
  const constructor = _dispatch[id];
  if (constructor) {
    return new constructor();
  } else {
    throw Error(`${id} does not have a corresponding state class in dispatch ${JSON.stringify(_dispatch)}`)
  }
}


@assocEventId
export class Sandstorm implements MarsEventState {
  finalize(game: GameState): void {
    game.upkeep -= 10;
    game.logs.push();
  }

  toJSON(): any {
  }
}

@assocEventId
export class PersonalGain implements MarsEventState {
  constructor(votes?: PersonalGainData) {
    this.votes = votes ?? _.cloneDeep(PersonalGain.defaultVotes);
  }

  private static defaultResponse: boolean = true;

  private static defaultVotes: PersonalGainData = {
    [CURATOR]: PersonalGain.defaultResponse,
    [ENTREPRENEUR]: PersonalGain.defaultResponse,
    [PIONEER]: PersonalGain.defaultResponse,
    [POLITICIAN]: PersonalGain.defaultResponse,
    [RESEARCHER]: PersonalGain.defaultResponse
  };

  private votes: PersonalGainData;

  finalize(game: GameState) {
    let subtractedUpkeep = 0;
    for (const role of ROLES) {
      if (this.votes[role]) {
        game.players[role].timeBlocks += 6;
        subtractedUpkeep += 6;
      }
    }
    game.subtractUpkeep(subtractedUpkeep);
    // create new MarsLogMessage
    // game.logs.push(message)
  }

  toJSON(): { [role in Role]: boolean } {
    return this.votes;
  }
}