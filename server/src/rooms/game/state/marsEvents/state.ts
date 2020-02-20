import {
  getEventName,
  MarsEventState,
  MarsEventStateConstructor,
} from "@/rooms/game/state/marsEvents/common";
import {GameState, MarsLogMessage} from "@/rooms/game/state";
import * as _ from "lodash";
import {CURATOR, ENTREPRENEUR, PIONEER, POLITICIAN, RESEARCHER, Role, ServerRole, ROLES} from "shared/types";
import { PersonalGainVotesData } from "shared/requests";
import { RsaPrivateKey } from "crypto";
import { Game } from "@/entity/Game";
import { GameEvent } from "@/entity/GameEvent";
import { EntityRepository } from "typeorm";
import { get } from "mongoose";

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

export abstract class BaseEvent implements MarsEventState {

  abstract finalize(game: GameState): void;


  getData() {
    // override in subtypes to add custom data to persist
    return {};
  }

  toJSON(): MarsEventSerialized {
    const json:MarsEventSerialized = {
      id: getEventName(this.constructor)
    }
    const extraData = this.getData();
    if (extraData) {
      json.data = _.cloneDeep(extraData);
    }
    return json;
  }

}

////////////////////////// Sandstorm //////////////////////////

@assocEventId
export class Sandstorm extends BaseEvent {
  finalize(game: GameState): void {
    game.upkeep -= 10;
    game.log('A sandstorm has decreased system health by 10.');
  }
}

////////////////////////// PersonalGain //////////////////////////

export type PersonalGainData = { [role in Role]: boolean };

@assocEventId
export class PersonalGain extends BaseEvent {

  private static defaultResponse: boolean = true;

  private static defaultVotes: PersonalGainData = {
    [CURATOR]: PersonalGain.defaultResponse,
    [ENTREPRENEUR]: PersonalGain.defaultResponse,
    [PIONEER]: PersonalGain.defaultResponse,
    [POLITICIAN]: PersonalGain.defaultResponse,
    [RESEARCHER]: PersonalGain.defaultResponse
  };

  private votes: PersonalGainData;

  constructor(votes?: PersonalGainData) {
    super();
    this.votes = votes ?? _.cloneDeep(PersonalGain.defaultVotes);
  }

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

    const message = `System health decreased by ${this.subtractedUpkeepTotal(subtractedUpkeep)}. The following players voted yes: ${this.playersVoteYes(this.votes)}`;
    game.log(message);
  }

  getData() {
    return this.votes;
  }
}

////////////////////////// Compulsive Philanthropy //////////////////////////

type CompulsivePhilanthropyData = { [role in Role]: Role }

@assocEventId
export class CompulsivePhilanthropy extends BaseEvent {

  votes: CompulsivePhilanthropyData;
  order: Array<Role>;

  constructor(data?: { votes: CompulsivePhilanthropyData, order: Array<Role> }) {
    super();
    this.votes = data?.votes ?? {
      [CURATOR]: CURATOR,
      [ENTREPRENEUR]: ENTREPRENEUR,
      [PIONEER]: PIONEER,
      [POLITICIAN]: POLITICIAN,
      [RESEARCHER]: RESEARCHER
    };
    this.order = data?.order ?? _.shuffle(_.cloneDeep(ROLES));
  }

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

    const winner:Role = _.find(this.order, (w:Role) => winners.includes(w)) || this.order[0];
    game.upkeep += game.players[winner].timeBlocks;
    game.players[winner].timeBlocks = 0;
    game.log(`${winner} voted to be compulsive philanthropist`);
  }

  getData() {
    return { votes: this.votes, order: this.order };
  }
}


////////////////////////// Out of Commission //////////////////////////

type OutOfCommissionData = { [role in Role]: Role }

abstract class OutOfCommission extends BaseEvent {
  player: Role = CURATOR;
  roles: OutOfCommissionData;

  constructor(public data?: { roles: OutOfCommissionData }) {
    super();
    this.roles = data?.roles ?? {
      [CURATOR]: CURATOR,
      [ENTREPRENEUR]: ENTREPRENEUR,
      [PIONEER]: PIONEER,
      [POLITICIAN]: POLITICIAN,
      [RESEARCHER]: RESEARCHER
    };
  }


  playerOutOfCommission(outOfCommission: Role): Role {
    var player: Role = this.roles[outOfCommission];
    return player;
  }
  
  finalize(game: GameState): void {
    var role: Role = this.playerOutOfCommission(this.player);
    game.players[role].timeBlocks = 3;
    game.log(`${this.player} has 3 timeblocks to invest during this round.`);
  }

  getData() {
    return { roles: this.roles };
  }
}

// Curator
@assocEventId
export class OutOfCommissionCurator extends OutOfCommission {
  constructor() {
    super();
  }
  player: Role = this.roles.Curator;
}

// Politician
@assocEventId
export class OutOfCommissionPolitician extends OutOfCommission {
  constructor() {
    super();
  }
  player: Role = this.roles.Politician;
}

// Researcher
@assocEventId
export class OutOfCommissionResearcher extends OutOfCommission {
  constructor() {
    super();
  }
  player: Role = this.roles.Researcher;
}

// Pioneer
@assocEventId
export class OutOfCommissionPioneer extends OutOfCommission {
  constructor() {
    super();
  }

  player: Role = this.roles.Pioneer;
}

// Entrepreneur
@assocEventId
export class OutOfCommissionEntrepreneur extends OutOfCommission {
  constructor() {
    super();
  }
  player: Role = this.roles.Entrepreneur;
}

////////////////////////// Audit //////////////////////////

@assocEventId
export class Audit extends BaseEvent {
  finalize(game: GameState) {
    game.log(`You will be able to view other players' resources.`);
  }
}
