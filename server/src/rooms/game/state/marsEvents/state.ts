import {
  getEventName,
  MarsEventState,
  MarsEventStateConstructor,
} from "@/rooms/game/state/marsEvents/common";
import {GameState, MarsLogMessage} from "@/rooms/game/state";
import * as _ from "lodash";
import {CURATOR, ENTREPRENEUR, PIONEER, POLITICIAN, RESEARCHER, Role, ROLES, SERVER} from "shared/types";

export type PersonalGainData = { [role in Role]: boolean };

const _dispatch: { [id: string]: MarsEventStateConstructor } = {};

export function assocEventId(constructor: MarsEventStateConstructor) {
  _dispatch[getEventName(constructor)] = constructor;
}

export function constructState(id: string, data?: any) {
  const constructor = _dispatch[id];
  if (constructor) {
    return new constructor(data);
  } else {
    throw Error(`${id} does not have a corresponding state class in dispatch ${JSON.stringify(_dispatch)}`)
  }
}

export interface MarsEventSerialized {
  id: string;
  data?: any;
}

@assocEventId
export class Sandstorm implements MarsEventState {
  finalize(game: GameState): void {
    game.upkeep -= 10;
    const msg = new MarsLogMessage({
      performedBy: SERVER,
      category: 'Mars Event',
      content: 'Sandstorm decreased upkeep by 10',
      timestamp: (new Date()).getTime()
    });
    game.logs.push(msg);
  }

  toJSON(): MarsEventSerialized {
    return {
      id: getEventName(this.constructor)
    }
  }
}

@assocEventId
export class PersonalGain implements MarsEventState {
  constructor(votes?: PersonalGainData) {
    this.votes = votes ?? _.cloneDeep(PersonalGain.defaultVotes);
  }

  private static defaultResponse: boolean = false;

  private static defaultVotes: PersonalGainData = {
    [CURATOR]: PersonalGain.defaultResponse,
    [ENTREPRENEUR]: PersonalGain.defaultResponse,
    [PIONEER]: PersonalGain.defaultResponse,
    [POLITICIAN]: PersonalGain.defaultResponse,
    [RESEARCHER]: PersonalGain.defaultResponse
  };

  private votes: PersonalGainData;

  updateVotes(player: Role, vote: boolean) {
    this.votes[player] = vote;
  }

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

    const msg = new MarsLogMessage({
      performedBy: SERVER,
      category: 'Mars Event',
      content: 'Personal Gain decreased upkeep',
      timestamp: (new Date()).getTime()
    });
    game.logs.push(msg);
  }

  toJSON(): MarsEventSerialized {
    return {
      id: getEventName(this.constructor),
      data: _.cloneDeep(this.votes)
    };
  }
}

type CompulsivePhilanthropyData = { [role in Role]: Role }

@assocEventId
export class CompulsivePhilanthropy implements MarsEventState {
  constructor(data?: { votes: CompulsivePhilanthropyData, order: Array<Role> }) {
    this.votes = data?.votes ?? {
      [CURATOR]: CURATOR,
      [ENTREPRENEUR]: ENTREPRENEUR,
      [PIONEER]: PIONEER,
      [POLITICIAN]: POLITICIAN,
      [RESEARCHER]: RESEARCHER
    };
    this.order = data?.order ?? _.shuffle(_.cloneDeep(ROLES));
  }

  votes: CompulsivePhilanthropyData;
  order: Array<Role>;

  voteForPlayer(voter: Role, philanthropist: Role) {
    this.votes[voter] = philanthropist;
  }

  finalize(game: GameState): void {
    const voteCounts: { [role in Role]: number } = {
      [CURATOR]: 0,
      [ENTREPRENEUR]: 0,
      [PIONEER]: 0,
      [POLITICIAN]: 0,
      [RESEARCHER]: 0
    };

    for (const philanthropist of Object.values(this.votes)) {
      voteCounts[philanthropist] += 1;
    }

    let [winners, count]: [Array<Role>, number] = [[], 0];
    for (const potentialWinner of ROLES) {
      if (voteCounts[potentialWinner] > count) {
        winners.splice(0, winners.length, potentialWinner);
        count = voteCounts[potentialWinner];
      } else if (voteCounts[potentialWinner] === count) {
        winners.push(potentialWinner)
      }
    }

    const winner = _.find(this.order, w => winners.includes(w)) || this.order[0];
    game.upkeep += game.players[winner].timeBlocks;
    game.players[winner].timeBlocks = 0;
  }

  toJSON(): MarsEventSerialized {
    return {
      id: getEventName(this.constructor),
      data: _.cloneDeep({ votes: this.votes, order: this.order })
    };
  }
}
