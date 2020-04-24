import {
  getEventName,
  MarsEventState,
  MarsEventStateConstructor,
} from "@port-of-mars/server/rooms/game/state/marsEvents/common";
import {GameState} from "@port-of-mars/server/rooms/game/state";
import * as _ from "lodash";
import {CURATOR, ENTREPRENEUR, PIONEER, POLITICIAN, RESEARCHER, Role, ROLES, Resource, InvestmentData, MarsLogCategory} from "@port-of-mars/shared/types";


const _dispatch: { [id: string]: MarsEventStateConstructor } = {};

export function formatEventName(eventName: string): string {
  return eventName.replace(/([A-Z])/g, ' $1').trim();
  // eventName = eventName.replace(/([A-Z])/g, ' $1').trim();
  // return [category.event].concat(eventName);
}

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

export interface BaseEvent {
  initialize?(game: GameState): void;
  finalize(game: GameState): void;
  getData?(): object;
  toJSON(): MarsEventSerialized;
}
export abstract class BaseEvent implements MarsEventState {

  toJSON(): MarsEventSerialized {
    const json: MarsEventSerialized = {
      id: getEventName(this.constructor)
    };
    if (this.getData) {
      json.data = _.cloneDeep(this.getData());
    }
    return json;
  }

}

////////////////////////// Sandstorm //////////////////////////

@assocEventId
export class Sandstorm extends BaseEvent {
  finalize(game: GameState): void {
    game.upkeep -= 10;
    game.log('A sandstorm has decreased system health by 10.', `MARS EVENT: ${ formatEventName(Sandstorm.name) }`);
  }
}

////////////////////////// LifeAsUsual //////////////////////////

@assocEventId
export class LifeAsUsual extends BaseEvent {
  finalize(game: GameState): void {
    game.log(`As the first human outpost on Mars, having a "usual" day is pretty unusual.`, `MARS EVENT: ${ formatEventName(LifeAsUsual.name) }`)
  }
}

////////////////////////// BreakdownOfTrust //////////////////////////

export type BreakdownOfTrustData = { [role in Role]: InvestmentData}

@assocEventId
export class BreakdownOfTrust extends BaseEvent {

  initialize(game: GameState){
    for(const player of game.players){
      player.invertPendingInventory();
      player.setTimeBlocks(2);
    }
  }

  updateSavedResources(player: Role, game: GameState, updatedInventory: InvestmentData){
    game.players[player].pendingInvestments.add(updatedInventory);
  }

  finalize(game: GameState): void {
    for(const player of game.players){
      player.mergePendingAndInventory();
      player.resetTimeBlocks();
    }

    game.log(`Each player chooses up to 2 Influence cards they own, then discards the rest.`, `MARS EVENT: ${formatEventName(BreakdownOfTrust.name)}`)
  }
}

////////////////////////// PersonalGain //////////////////////////

export type PersonalGainData = { [role in Role]: boolean };

@assocEventId
export class PersonalGain extends BaseEvent {

  private static defaultResponse = true;

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
    let player = '';
    const playerYesVotes: Array<string> = [];
    let formattedPlayerList = '';

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
    game.log(message, `MARS EVENT: ${ formatEventName(PersonalGain.name) }`);
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

  constructor(data?: { votes: CompulsivePhilanthropyData; order: Array<Role> }) {
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

    const winners: Array<Role> = []
    let count = 0;
    for (const potentialWinner of ROLES) {
      if (voteCounts[potentialWinner] > count) {
        winners.splice(0, winners.length, potentialWinner);
        count = voteCounts[potentialWinner];
      } else if (voteCounts[potentialWinner] === count) {
        winners.push(potentialWinner)
      }
    }

    const winner: Role = _.find(this.order, (w: Role) => winners.includes(w)) || this.order[0];
    game.upkeep += game.players[winner].timeBlocks;
    game.players[winner].timeBlocks = 0;
    game.log(
      `The ${winner} was voted to be Compulsive Philanthropist with ${count} votes. The ${winner} invested all of their timeblocks into System Health.`,
      `MARS EVENT: ${ formatEventName(CompulsivePhilanthropy.name) }`
    );
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
    const player: Role = this.roles[outOfCommission];
    return player;
  }
  
  finalize(game: GameState): void {
    const role: Role = this.playerOutOfCommission(this.player);
    game.players[role].timeBlocks = 3;
    game.log(
      `${this.player} has 3 time blocks to invest during this round.`,
      `MARS EVENT: ${ formatEventName(OutOfCommission.name) }`
    );
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
    game.log(
      `You will be able to view other players' resources. Hover over each player tab on the right to reveal their inventory.`,
      `MARS EVENT: ${ formatEventName(Audit.name) }`
    );
  }
}

////////////////////////// Bonding Through Adversity //////////////////////////

type BondingThroughAdversityData = { [role in Role]: Resource}

@assocEventId
export class BondingThroughAdversity extends BaseEvent {
  // The Player's default Influence vote
  private static defaultInfluenceVote: Resource;

  // Default Influence votes associated with each Role
  private static defaultInfluenceVotes: BondingThroughAdversityData = {
    [CURATOR]: BondingThroughAdversity.defaultInfluenceVote,
    [ENTREPRENEUR]: BondingThroughAdversity.defaultInfluenceVote,
    [PIONEER]: BondingThroughAdversity.defaultInfluenceVote,
    [POLITICIAN]: BondingThroughAdversity.defaultInfluenceVote,
    [RESEARCHER]: BondingThroughAdversity.defaultInfluenceVote,
  };

  // Map Influence votes to Roles
  private votes: BondingThroughAdversityData;

  // Clone Default Influence votes
  constructor(votes?: BondingThroughAdversityData) {
    super();
    this.votes = votes ?? _.cloneDeep(BondingThroughAdversity.defaultInfluenceVotes);
  }
  
  /**
   * Change Influence votes associated with each Role after a Player votes.
   * @param player The Role
   * @param vote The Influence the Player voted for 
   * 
   */
  updateVotes(player: Role, vote: Resource): void {
    this.votes[player] = vote;
  }

  /**
   * Change each Player's resource inventory with their Influence vote via game state and
   * push a message to the mars log.
   * @param game The current Game State 
   * 
   */
  finalize(game: GameState): void {
    for (const role of ROLES) {
      game.players[role].inventory[this.votes[role]] += 1;

    }
    const message = `Players have gained one influence currency of their choice.`
    game.log(message, `MARS EVENT: ${ formatEventName(BondingThroughAdversity.name) }`);
  }

  /**
   * Retrieve Role and Influence vote associated with each Player.
   * @return Role and Influence votes associated with each Role.
   * 
   */
  getData(): BondingThroughAdversityData {
    return this.votes;
  }
}

export class ChangingTides extends BaseEvent {
  finalize(game: GameState): void {
    for (const role of ROLES) {
      const player = game.players[role];
      player.accomplishments.discardAll();
      player.accomplishments.draw(1);
    }
    game.log(
      'Each player discards their current Accomplishments and draws one new Accomplishment.',
      `MARS EVENT: ${ formatEventName(ChangingTides.name) }`
    );
  }
}
