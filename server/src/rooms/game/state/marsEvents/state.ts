import {
  getEventName,
  MarsEventState,
  MarsEventStateConstructor,
} from "@/rooms/game/state/marsEvents/common";
import {GameState, MarsLogMessage} from "@/rooms/game/state";
import * as _ from "lodash";
import {CURATOR, ENTREPRENEUR, PIONEER, POLITICIAN, RESEARCHER, Role, ROLES, SERVER} from "shared/types";
import { PersonalGainVotesData } from "shared/requests";
import { RsaPrivateKey } from "crypto";
import { Game } from "@/entity/Game";
import { GameEvent } from "@/entity/GameEvent";
import { EntityRepository } from "typeorm";
import { get } from "mongoose";
import { OutOfCommissionCuratorCmd } from "../../commands";

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

////////////////////////// Sandstorm //////////////////////////

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

////////////////////////// PersonalGain //////////////////////////

export type PersonalGainData = { [role in Role]: boolean };

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

  updateVotes(player: Role, vote: boolean) {
    this.votes[player] = vote;
  }

  subtractedUpkeepTotal(upkeep: number) {
    return upkeep;
  }

  playersVoteYes(voteResults: PersonalGainData): string  {
    var player: string = '';
    var playerYesVotes: Array<String> = [];
    var formattedPlayerList: string = '';

    for (const role of ROLES) {
      if (voteResults[role]) {
        player = role.toString();
        playerYesVotes.push(player);
      }
    }

    formattedPlayerList = playerYesVotes.toString();

    return formattedPlayerList;
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

    const msg = new MarsLogMessage({
      performedBy: SERVER,
      category: 'Mars Event',
      content: 'Upkeep decreased by ' + this.subtractedUpkeepTotal(subtractedUpkeep) +
                '. The following players voted yes: ' + this.playersVoteYes(this.votes),
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

////////////////////////// Compulsive Philanthropy //////////////////////////

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

    game.logs.push(new MarsLogMessage({
      performedBy: SERVER,
      category: 'Mars Event',
      content: `${winner} voted to be compulsive philanthropist`,
      timestamp: (new Date()).getTime()
    }));

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


////////////////////////// Out of Commission //////////////////////////

type OutOfCommissionData = { [role in Role]: Role }

abstract class OutOfCommission implements MarsEventState {
  constructor(public data?: { roles: OutOfCommissionData }) {
      this.roles = data?.roles ?? {
      [CURATOR]: CURATOR,
      [ENTREPRENEUR]: ENTREPRENEUR,
      [PIONEER]: PIONEER,
      [POLITICIAN]: POLITICIAN,
      [RESEARCHER]: RESEARCHER
    };
  }

  roles: OutOfCommissionData;

  playerOutOfCommission(outOfCommission: Role): Role {
    var player: Role = this.roles[outOfCommission];
    return player;
  }
  
  abstract finalize(game: GameState): void;

  abstract toJSON(): MarsEventSerialized;
}

// Curator
@assocEventId
export class OutOfCommissionCurator extends OutOfCommission {
  constructor() {
    super();
  }

  finalize(game: GameState): void {
    var player: Role = this.playerOutOfCommission(CURATOR);
    game.players[player].timeBlocks = 3;

    const msg = new MarsLogMessage({
      performedBy: SERVER,
      category: 'Mars Event',
      content: 'Curator has 3 timeblocks to invest during this round.',
      timestamp: (new Date()).getTime()
    });
    game.logs.push(msg);
  }

  toJSON(): MarsEventSerialized {
    return {
      id: getEventName(this.constructor),
      data: _.cloneDeep({ roles: this.roles })
    };
  }
}

// Politician
@assocEventId
export class OutOfCommissionPolitician extends OutOfCommission {
  constructor() {
    super();
  }

  finalize(game: GameState): void {
    var player: Role = this.playerOutOfCommission(POLITICIAN);
    game.players[player].timeBlocks = 3;

    const msg = new MarsLogMessage ({
      performedBy: SERVER,
      category: 'Mars Event',
      content: 'Politician has 3 timeblocks to invest during this round.',
      timestamp: (new Date()).getTime()
    })
    game.logs.push(msg);
  }

  toJSON(): MarsEventSerialized {
    return {
      id: getEventName(this.constructor),
      data: _.cloneDeep({ roles: this.roles })
    };
  }
}

// Researcher
@assocEventId
export class OutOfCommissionResearcher extends OutOfCommission {
  constructor() {
    super();
  }

  finalize(game: GameState): void {
    var player: Role = this.playerOutOfCommission(RESEARCHER);
    game.players[player].timeBlocks = 3;

    const msg = new MarsLogMessage ({
      performedBy: SERVER,
      category: 'Mars Event',
      content: 'Researcher has 3 timeblocks to invest during this round.',
      timestamp: (new Date()).getTime()
    })
    game.logs.push(msg);
  }

  toJSON(): MarsEventSerialized {
    return {
      id: getEventName(this.constructor),
      data: _.cloneDeep({ roles: this.roles })
    }
  }
}