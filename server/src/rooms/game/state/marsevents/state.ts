import * as _ from "lodash";
import { getEventName, MarsEventState, MarsEventStateConstructor } from "./common";
import {
  ActionOrdering,
  GameState,
  SystemHealthMarsEvent,
} from "@port-of-mars/server/rooms/game/state";
import {
  CURATOR,
  ENTREPRENEUR,
  InvestmentData,
  MarsLogCategory,
  PIONEER,
  POLITICIAN,
  RESEARCHER,
  Resource,
  ResourceCostData,
  RESOURCES,
  Role,
  ROLES,
} from "@port-of-mars/shared/types";
import { Constants } from "@port-of-mars/shared/settings";
import { getLogger } from "@port-of-mars/server/settings";
import { getAccomplishmentByID } from "@port-of-mars/server/data/Accomplishment";
import { getMarsEvent } from "@port-of-mars/server/data/MarsEvents";

const logger = getLogger(__filename);

const _dispatch: { [id: string]: MarsEventStateConstructor } = {};

export function assocEventId(constructor: MarsEventStateConstructor): void {
  _dispatch[getEventName(constructor)] = constructor;
}

export function constructState(id: string, data?: any): MarsEventState {
  const constructor = _dispatch[id];
  if (constructor) {
    return new constructor(data);
  } else {
    throw Error(
      `${id} does not have a corresponding state class constructor in dispatch ${JSON.stringify(
        _dispatch
      )}`
    );
  }
}

export interface MarsEventSerialized {
  id: string;
  data?: any;
}

export interface BaseEvent {
  initialize?(game: GameState): void;

  finalize(game: GameState): void;

  getData?(): Record<string, unknown>;

  toJSON(): MarsEventSerialized;
}

export abstract class BaseEvent implements MarsEventState {
  json: MarsEventSerialized = {
    id: getEventName(this.constructor),
  };

  name = getMarsEvent(this.json.id).name;
  title = `${MarsLogCategory.event}: ${this.name}`;
  effect = getMarsEvent(this.json.id).effect;

  toJSON(): MarsEventSerialized {
    if (this.getData) {
      this.json.data = _.cloneDeep(this.getData());
    }
    return this.json;
  }
}

// Audit
@assocEventId
export class Audit extends BaseEvent {
  finalize(game: GameState): void {
    game.log(this.effect, this.title);
  }
}

// Bonding Through Adversity
type BondingThroughAdversityData = { [role in Role]: Resource };

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

    // FIXME: check effect
    const message = `Players have gained one influence currency of their choice.`;
    game.log(message, this.title);
  }

  /**
   * Retrieve Role and Influence vote associated with each Player.
   * @return Role and Influence votes associated with each Role.
   */
  getData(): BondingThroughAdversityData {
    return this.votes;
  }
}

// Changing Tides
@assocEventId
export class ChangingTides extends BaseEvent {
  finalize(game: GameState): void {
    for (const role of ROLES) {
      const player = game.players[role];
      player.accomplishments.discardAll();
      player.accomplishments.draw(1);
    }
    game.log(
      "Each player discards their current Accomplishments and draws one new Accomplishment.",
      this.title
    );
  }
}

// Breakdown of Trust
export type BreakdownOfTrustData = { [role in Role]: number };

@assocEventId
export class BreakdownOfTrust extends BaseEvent {
  //converts the roles array into an object that looks like BreakdownOfTrustData
  private savedtimeBlockAllocations: BreakdownOfTrustData = ROLES.reduce((obj, role) => {
    //these are placeholder values, they will be overridden.
    obj[role] = 0;
    return obj;
  }, {} as BreakdownOfTrustData);

  initialize(game: GameState): void {
    for (const player of game.players) {
      // player.invertPendingInventory(); FIXME: why was this needed?
      // player.clearPendingInventory();
      // save the timeblock amount the player is allotted for the round
      this.savedtimeBlockAllocations[player.role] = player.currentTimeBlocksAmount;
      //set them to 2 for the event
      player.setTimeBlocks(2);
    }
  }

  setInventory(player: Role, game: GameState, updatedInventory: InvestmentData): void {
    logger.debug("setting pending investments to: %o", { updatedInventory });
    game.players[player].pendingInvestments.updateAsInventory(updatedInventory);
  }

  finalize(game: GameState): void {
    for (const player of game.players) {
      player.assignPendingInvestmentsToInventory();
      //set that value back to the preserved amount before the event
      player.timeBlocks = this.savedtimeBlockAllocations[player.role];
    }
    game.log(this.effect, this.title);
  }
}

// Compulsive Philanthropy
type CompulsivePhilanthropyData = { [role in Role]: Role };

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
      [RESEARCHER]: RESEARCHER,
    };
    this.order = data?.order ?? _.shuffle(_.cloneDeep(ROLES));
  }

  voteForPlayer(voter: Role, philanthropist: Role): void {
    this.votes[voter] = philanthropist;
  }

  finalize(game: GameState): void {
    const voteCounts: { [role in Role]: number } = {
      [CURATOR]: 0,
      [ENTREPRENEUR]: 0,
      [PIONEER]: 0,
      [POLITICIAN]: 0,
      [RESEARCHER]: 0,
    };

    for (const philanthropist of Object.values(this.votes)) {
      voteCounts[philanthropist] += 1;
    }

    const winners: Array<Role> = [];
    let count = 0;
    for (const potentialWinner of ROLES) {
      if (voteCounts[potentialWinner] > count) {
        winners.splice(0, winners.length, potentialWinner);
        count = voteCounts[potentialWinner];
      } else if (voteCounts[potentialWinner] === count) {
        winners.push(potentialWinner);
      }
    }
    const winner: Role = _.find(this.order, (w: Role) => winners.includes(w)) || this.order[0];
    game.log(
      `The ${winner} was voted Compulsive Philanthropist with ${count} votes. The ${winner} must invest 
        all of their time blocks this round into System Health.`,
      this.title
    );
    game.pendingMarsEventActions.push({
      ordering: ActionOrdering.LAST,
      execute: state => {
        const philanthropist = state.players[winner];
        philanthropist.setCompulsivePhilanthropist();
      },
    });
  }

  getData(): {
    votes: CompulsivePhilanthropyData;
    order: Array<Role>;
  } {
    return { votes: this.votes, order: this.order };
  }
}

// Crop Failure
@assocEventId
export class CropFailure extends BaseEvent {
  finalize(game: GameState): void {
    game.applySystemHealthMarsEvent(
      new SystemHealthMarsEvent({
        label: this.title,
        systemHealthModification: -20,
      })
    );
    game.log(this.effect, this.title);
  }
}

// Difficult Conditions
@assocEventId
export class DifficultConditions extends BaseEvent {
  finalize(game: GameState): void {
    for (const player of game.players) {
      player.costs.systemHealth *= 2;
    }
    game.log(this.effect, this.title);
  }
}

// Efforts Wasted
@assocEventId
export class EffortsWasted extends BaseEvent {
  accomplishmentsToDiscard: Partial<{ [role in Role]: number }> = {};

  discardAccomplishment(role: Role, id: number): void {
    this.accomplishmentsToDiscard[role] = id;
  }

  fillAccomplishmentsToDiscard(game: GameState): void {
    for (const role of ROLES) {
      const purchased = game.players[role].accomplishments.purchased;
      if (_.isUndefined(this.accomplishmentsToDiscard[role]) && purchased.length > 0) {
        this.discardAccomplishment(role, purchased[0].id);
      }
    }
  }

  finalize(game: GameState): void {
    this.fillAccomplishmentsToDiscard(game);
    logger.info("Efforts wasted %o", this.accomplishmentsToDiscard);
    const discards: Array<string> = [];
    for (const role of ROLES) {
      const id = this.accomplishmentsToDiscard[role];
      if (!_.isUndefined(id)) {
        const accomplishment = getAccomplishmentByID(role, id);
        discards.push(
          `${role} discarded ${accomplishment.label} for ${accomplishment.victoryPoints}`
        );
        game.players[role].discardPurchasedAccomplishment(id);
        game.players[role].victoryPoints -= accomplishment.victoryPoints;
      }
    }
    game.log(discards.join(", "), this.title);
  }
}

// Hero or Pariah
type HeroOrPariahData = Partial<{ [role in Role]: "hero" | "pariah" | "" }>;
type playerVotesData = { [role in Role]: Role };

@assocEventId
export class HeroOrPariah extends BaseEvent {
  private static defaultPlayerVotes: playerVotesData = {
    [CURATOR]: CURATOR,
    [ENTREPRENEUR]: ENTREPRENEUR,
    [PIONEER]: PIONEER,
    [POLITICIAN]: POLITICIAN,
    [RESEARCHER]: RESEARCHER,
  };
  private heroOrPariahVotes: HeroOrPariahData = {};
  private playerVotes: playerVotesData;
  winner!: Role;

  constructor(data?: {
    heroOrPariahVotes?: HeroOrPariahData;
    playerVotes: playerVotesData;
    order: Array<Role>;
  }) {
    super();
    this.playerVotes = data?.playerVotes ?? _.cloneDeep(HeroOrPariah.defaultPlayerVotes);
  }

  hasVoted(role: Role): boolean {
    return !_.isUndefined(this.heroOrPariahVotes[role]);
  }

  voteHeroOrPariah(player: Role, vote: "hero" | "pariah", game: GameState): void {
    this.heroOrPariahVotes[player] = vote;
    logger.debug("votes: %o", this.heroOrPariahVotes);
    // check that all players have voted
    if (Object.keys(this.heroOrPariahVotes).length === ROLES.length) {
      // number of hero votes
      const heroVotes = Object.values(this.heroOrPariahVotes).filter(v => v == "hero").length;

      // FIXME this will probably end to change when we have > 5 players in a group
      game.heroOrPariah = heroVotes > 2 ? "hero" : "pariah";
    }
  }

  voteForPlayer(voter: Role, heroOrPariah: Role): void {
    this.playerVotes[voter] = heroOrPariah;
  }

  tie(votes: Array<[string, number]>): boolean {
    return (
      _.filter(votes, o => o[1] == 2).length == 2 || _.filter(votes, o => o[1] == 1).length == 5
    );
  }

  finalize(game: GameState): void {
    // determine who is hero or pariah
    const votes: { [role in Role]: number } = {
      [CURATOR]: 0,
      [ENTREPRENEUR]: 0,
      [PIONEER]: 0,
      [POLITICIAN]: 0,
      [RESEARCHER]: 0,
    };

    for (const votedPlayer of Object.values(this.playerVotes)) {
      votes[votedPlayer] += 1;
    }

    // order by: highest vote to lowest vote
    // _.toPairs => [[ROLE, vote], ... [ROLE, vote]]
    // _.orderBy => [[ROLE, highest vote], ... [ROLE, lowest vote]]
    const winners = _.orderBy(_.toPairs(votes), o => o[1], "desc");
    logger.debug("winners: %o", winners);

    const isTie = this.tie(winners);

    if (isTie) {
      logger.debug(
        "2-way tie: %o",
        _.filter(winners, o => o[1] == 2)
      );
      logger.debug(
        "5-way tie: %o",
        _.filter(winners, o => o[1] == 1)
      );
      // pick a winner randomly
      this.winner = winners[Math.floor(Math.random() * winners.length)][0] as Role;
    } else {
      this.winner = winners[0][0] as Role;
    }

    // mars log messaging

    // if winner is a hero
    if (game.heroOrPariah == "hero") {
      // gain 4 of their speciality resource
      const specialty = game.players[this.winner].specialty;
      game.players[this.winner].inventory[specialty] += 4;

      if (isTie) {
        game.log(
          `Because of a voting tie, ${this.winner} is randomly voted a Hero and has gained 4 ${specialty}.`,
          this.title
        );
      } else {
        game.log(
          `${this.winner} is voted a Hero and has gained 4 ${specialty} after receiving ${
            votes[this.winner]
          } 
      votes.`,
          this.title
        );
      }

      // if winner is pariah
    } else {
      // lose all resources
      for (const resource of RESOURCES) {
        game.players[this.winner].inventory[resource] = 0;
      }

      if (isTie) {
        game.log(
          `Because of a voting tie, ${this.winner} is randomly voted a Pariah and has lost all 
        their Influence resources.`,
          this.title
        );
      } else {
        game.log(
          `${
            this.winner
          } is voted a Pariah and has lost all their Influence resources after receiving 
      ${votes[this.winner]} votes.`,
          this.title
        );
      }
    }
  }
}

// Hull Breach
@assocEventId
export class HullBreach extends BaseEvent {
  finalize(game: GameState): void {
    game.applySystemHealthMarsEvent(
      new SystemHealthMarsEvent({
        label: this.title,
        systemHealthModification: -7,
      })
    );
    game.log(this.effect, this.title);
  }
}

// Interdisciplinary
@assocEventId
export class Interdisciplinary extends BaseEvent {
  costs?: { [role in Role]: ResourceCostData };

  makeResourcesAvailable(costs: ResourceCostData): void {
    for (const resource of RESOURCES) {
      if (costs[resource] === Constants.MAXIMUM_COST) {
        costs[resource] = 3;
      }
    }
  }

  finalize(game: GameState): void {
    for (const role of ROLES) {
      this.makeResourcesAvailable(game.players[role].costs);
    }
    game.log(this.effect, this.title);
  }
}

// Life as Usual
@assocEventId
export class LifeAsUsual extends BaseEvent {
  finalize(game: GameState): void {
    game.log(this.effect, this.title);
  }
}

// Lost Time
@assocEventId
export class LostTime extends BaseEvent {
  finalize(game: GameState): void {
    game.pendingMarsEventActions.push({
      ordering: ActionOrdering.LAST,
      execute: state => {
        for (const role of ROLES) {
          const timeBlocks = state.players[role].timeBlocks - 5;
          state.players[role].timeBlocks = Math.max(0, timeBlocks);
        }
        state.log(this.effect, this.title);
      },
    });
  }
}

// Markets Closed
@assocEventId
export class MarketsClosed extends BaseEvent {
  finalize(game: GameState): void {
    game.disableTrading();
    game.log(this.effect, this.title);
  }
}

// Murphy's Law
@assocEventId
export class MurphysLaw extends BaseEvent {
  initialize(game: GameState): void {
    game.drawMarsEvents(2);
  }

  finalize(game: GameState): void {
    game.log(this.effect, this.title);
  }
}

// Out of Commission
abstract class OutOfCommission extends BaseEvent {
  player: Role = CURATOR;

  constructor() {
    super();
  }

  finalize(game: GameState): void {
    game.pendingMarsEventActions.push({
      ordering: ActionOrdering.MIDDLE,
      execute: state => {
        state.players[this.player].timeBlocks = 3;
        state.log(`${this.player} has 3 time blocks to invest during this round.`, this.title);
      },
    });
  }

  getData() {
    return { player: this.player };
  }
}

// Curator
@assocEventId
export class OutOfCommissionCurator extends OutOfCommission {
  player: Role = CURATOR;

  constructor() {
    super();
  }
}

// Politician
@assocEventId
export class OutOfCommissionPolitician extends OutOfCommission {
  player: Role = POLITICIAN;

  constructor() {
    super();
  }
}

// Researcher
@assocEventId
export class OutOfCommissionResearcher extends OutOfCommission {
  player: Role = RESEARCHER;

  constructor() {
    super();
  }
}

// Pioneer
@assocEventId
export class OutOfCommissionPioneer extends OutOfCommission {
  player: Role = PIONEER;

  constructor() {
    super();
  }
}

// Entrepreneur
@assocEventId
export class OutOfCommissionEntrepreneur extends OutOfCommission {
  player: Role = ENTREPRENEUR;

  constructor() {
    super();
  }
}

// Personal Gain
export type PersonalGainData = { [role in Role]: boolean };

@assocEventId
export class PersonalGain extends BaseEvent {
  private static defaultResponse = true;

  private static defaultVotes: PersonalGainData = {
    [CURATOR]: PersonalGain.defaultResponse,
    [ENTREPRENEUR]: PersonalGain.defaultResponse,
    [PIONEER]: PersonalGain.defaultResponse,
    [POLITICIAN]: PersonalGain.defaultResponse,
    [RESEARCHER]: PersonalGain.defaultResponse,
  };

  private votes: PersonalGainData;

  constructor(votes?: PersonalGainData) {
    // currently used when reconstructing from the DB
    super();
    this.votes = votes ?? _.cloneDeep(PersonalGain.defaultVotes);
  }

  updateVotes(player: Role, vote: boolean): void {
    // invoked by a player request -> command -> game event
    this.votes[player] = vote;
  }

  /**
   * Returns a comma separated string with all of the players that voted
   * yes for the Personal Gain event.
   * @param voteResults an object that maps Role->boolean where true = yes, false = no
   * @returns
   */
  yesVotePlayers(voteResults: PersonalGainData): string {
    return ROLES.filter(role => voteResults[role]).join(", ");
  }

  finalize(game: GameState): void {
    const yesVotePlayers = this.yesVotePlayers(this.votes);
    game.pendingMarsEventActions.push({
      ordering: ActionOrdering.FIRST,
      execute: state => {
        let systemHealthReduction = 0;
        for (const role of ROLES) {
          if (this.votes[role]) {
            state.players[role].timeBlocks += 6;
            systemHealthReduction += 6;
          }
        }
        state.applySystemHealthMarsEvent(
          new SystemHealthMarsEvent({
            label: this.title,
            systemHealthModification: -systemHealthReduction,
          })
        );
        const message = `System health decreased by ${systemHealthReduction}. The following players voted yes: ${yesVotePlayers}`;
        state.log(message, this.title);
      },
    });
  }

  getData(): PersonalGainData {
    return this.votes;
  }
}

// Sandstorm
@assocEventId
export class Sandstorm extends BaseEvent {
  finalize(game: GameState): void {
    game.applySystemHealthMarsEvent(
      new SystemHealthMarsEvent({
        label: this.title,
        systemHealthModification: -10,
      })
    );
    game.log(this.effect, this.title);
  }
}

// Solar Flare
@assocEventId
export class SolarFlare extends BaseEvent {
  finalize(game: GameState): void {
    game.applySystemHealthMarsEvent(
      new SystemHealthMarsEvent({
        label: this.title,
        systemHealthModification: -5,
      })
    );
    game.disableTrading();
    game.log(this.effect, this.title);
  }
}

// Stymied
@assocEventId
export class Stymied extends BaseEvent {
  finalize(game: GameState): void {
    for (const player of game.players) {
      player.costs[player.specialty] = Constants.MAXIMUM_COST;
    }
    game.log(this.effect, this.title);
  }
}

export function downCastEventState<T extends BaseEvent, R>(
  classDef: { new (...args: any): T },
  game: GameState,
  callBack: (currentEvent: T) => R
): R | undefined {
  const eventState = game.currentEvent.state;
  if (eventState instanceof classDef) {
    return callBack(eventState);
  } else {
    logger.warn("expected event state is the wrong type %o", eventState);
  }
}
