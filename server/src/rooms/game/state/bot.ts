import {
  CURATOR,
  EventClientView,
  InvestmentData, INVESTMENTS,
  Phase,
  ResourceAmountData, RESOURCES,
  Role,
  ROLES
} from "@port-of-mars/shared/types";
import {Bot, GameState, Player, Trade} from "@port-of-mars/server/rooms/game/state/index";
import {GameEvent} from "@port-of-mars/server/rooms/game/events/types";
import {
  AcceptedTradeRequest, BotControlRelinquished, DiscardedAccomplishment, KeptResources,
  PurchasedAccomplishment, SelectedInfluence,
  SetPlayerReadiness,
  TimeInvested, VotedForPersonalGain, VotedForPhilanthropist
} from "@port-of-mars/server/rooms/game/events";
import {BotControlTaken} from "@port-of-mars/server/rooms/game/events";
import {getLogger} from "@port-of-mars/server/settings";
import _ from "lodash";

const logger = getLogger(__filename);

export type AbstractMarsEventVisitor ={[view in EventClientView]: (state: GameState, player: Player) => Array<GameEvent>};

// bot actions: voting events
export class MarsEventVisitor implements AbstractMarsEventVisitor {
  NO_CHANGE(state: GameState, player: Player): Array<GameEvent> {
    return [new SetPlayerReadiness({value: true, role: player.role})]
  }
  AUDIT(state: GameState, player: Player): Array<GameEvent> {
    return [new SetPlayerReadiness({value: true, role: player.role})]
  }
  DISABLE_CHAT(state: GameState, player: Player): Array<GameEvent> {
    return [new SetPlayerReadiness({value: true, role: player.role})]
  }
  VOTE_YES_NO(state: GameState, player: Player): Array<GameEvent> {
    return [new VotedForPersonalGain({vote: state.upkeep > 30, role: player.role})]
  }
  VOTE_FOR_PLAYER_SINGLE(state: GameState, player: Player): Array<GameEvent> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const defaultRole: Role = _.find(ROLES, r => r !== player.role)!;
    const [role, points] = _.reduce(ROLES, ([r, p], role) => {
      if (role !== player.role && player.victoryPoints > p) {
        r = player.role;
        p = player.victoryPoints;
      }
      return [r, p]
    }, [defaultRole, state.players[defaultRole].victoryPoints]);

    return [new VotedForPhilanthropist({ voter: player.role, vote: role })]
  }
  VOTE_FOR_PLAYER_HERO_PARIAH(state: GameState, player: Player): Array<GameEvent> {
    // no corresponding mars event
    return [new SetPlayerReadiness({value: true, role: player.role})]
  }
  INFLUENCES_SELECT(state: GameState, player: Player): Array<GameEvent> {
    const savedResources: InvestmentData = {
      culture: - player.inventory.culture,
      finance: - player.inventory.finance,
      government: - player.inventory.government,
      legacy: - player.inventory.legacy,
      science: - player.inventory.science,
      upkeep: 0
    };

    let unitsRemaining = 2;
    for (const resource of RESOURCES) {
      if (unitsRemaining === 0) {
        break;
      }
      if (player.inventory[resource] > 0) {
        const resourceUnits = player.inventory[resource];
        const unitsToTake = Math.min(resourceUnits, unitsRemaining);
        savedResources[resource] += unitsToTake;
        unitsRemaining -= unitsToTake;
      }
    }
    logger.info('influences draw %o', savedResources);
    return [new KeptResources({role: player.role, savedResources})]
  }
  INFLUENCES_DRAW(state: GameState, player: Player): Array<GameEvent> {
    return [new SelectedInfluence({role: player.role, influence: 'culture'})]
  }
  ACCOMPLISHMENT_SELECT_PURCHASED(state: GameState, player: Player): Array<GameEvent> {
    return [new SetPlayerReadiness({value: true, role: player.role})]
  }
}

// bot actions: per phase
export class ActorRunner implements Actor {
  marsEventVisitor = new MarsEventVisitor();

  [Phase.newRound](state: GameState, player: Player): Array<GameEvent> {
    if (player.ready) {
      return [];
    }
    else {
      return [new SetPlayerReadiness({value: true, role: player.role})];
    }
  }

  [Phase.events](state: GameState, player: Player): Array<GameEvent> {
    if (player.ready) {
      return [];
    }
    const marsEvent = state.currentEvent;
    return this.marsEventVisitor[marsEvent.clientViewHandler](state, player);
  }

  [Phase.invest](state: GameState, player: Player): Array<GameEvent> {
    if (player.ready) {
      return [];
    }
    const tbs = player.timeBlocks;
    const speciality = player.specialty;
    const specialityCost = player.costs[speciality];
    const specialityUnits = Math.floor(tbs / specialityCost * 0.5);
    const upkeepCost = player.costs['upkeep'];
    const upkeepUnits = Math.floor((tbs - specialityCost*specialityUnits)/upkeepCost);
    const investment: InvestmentData = {
      culture: 0,
      finance: 0,
      government: 0,
      legacy: 0,
      science: 0,
      upkeep: upkeepUnits
    };
    investment[speciality] = specialityUnits;
    return [
      new TimeInvested({investment, role: player.role}),
      new SetPlayerReadiness({value: true, role: player.role})
    ];
  }

  [Phase.trade](state: GameState, player: Player): Array<GameEvent> {
    const events: Array<GameEvent> = [];
    for (const id of Object.keys(state.tradeSet)) {
      const trade: Trade = state.tradeSet[id];
      if (trade.status === 'Active' && trade.sender.role === player.role) {
        events.push(new AcceptedTradeRequest({id}));
        break;
      }
    }
    if (!player.ready) {
      events.push(new SetPlayerReadiness({value: true, role: player.role}))
    }
    return events;
  }

  [Phase.purchase](state: GameState, player: Player): Array<GameEvent> {
    for (const accomplishment of player.accomplishments.purchasable) {
      if (player.isAccomplishmentPurchaseFeasible(accomplishment)) {
        return [new PurchasedAccomplishment({accomplishment, role: player.role})]
      }
    }
    if (!player.ready) {
      return [new SetPlayerReadiness({value: true, role: player.role})];
    }
    return []
  }

  [Phase.discard](state: GameState, player: Player): Array<GameEvent> {
    if (player.ready) {
      return [];
    }
    // Discard all screw cards
    const events: Array<GameEvent> = [];
    for (const accomplishment of player.accomplishments.purchasable) {
      if (accomplishment.upkeep <= 0) {
        events.push(new DiscardedAccomplishment({id: accomplishment.id, role: player.role}))
      }
    }
    events.push(new SetPlayerReadiness({value: true, role: player.role}))
    return events;
  }

  [Phase.defeat](state: GameState, player: Player): Array<GameEvent> {
    return []
  }

  [Phase.victory](state: GameState, player: Player): Array<GameEvent> {
    return []
  }
}

export class SimpleBot implements Bot {
  elapsed = 0;
  maxInactivityTime = 60;
  active = false;

  constructor(public actor: ActorRunner) {}

  static fromActor(): SimpleBot {
    return new SimpleBot(new ActorRunner());
  }

  incrementElapsed(): void {
    this.elapsed += 1;
  }

  resetElapsed(): void {
    this.elapsed = 0;
  }

  get shouldBeActive(): boolean {
    return this.elapsed >= this.maxInactivityTime;
  }

  act(state: GameState, player: Player): Array<GameEvent> {
    logger.info('act %s, active %d, should be %d', player.role, this.active, this.shouldBeActive);
    this.incrementElapsed();
    if (this.active) {
      if (this.shouldBeActive) {
        const events = this.actor[state.phase](state, player);
        logger.debug('actor events performed: %o', events);
        return events;
      } else {
        return [new BotControlRelinquished({role: player.role})]
      }
    } else {
      if (this.shouldBeActive) {
        return [new BotControlTaken({role: player.role})]
      } else {
        return [];
      }
    }
  }
}

export type Actor = { [phase in Phase]: (state: GameState, player: Player) => Array<GameEvent> }