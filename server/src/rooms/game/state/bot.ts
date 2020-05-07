import {InvestmentData, Phase} from "@port-of-mars/shared/types";
import {Bot, GameState, Player} from "@port-of-mars/server/rooms/game/state/index";
import {GameEvent} from "@port-of-mars/server/rooms/game/events/types";
import {
  AcceptedTradeRequest, BotControlRelinquished, DiscardedAccomplishment,
  PurchasedAccomplishment,
  SetPlayerReadiness,
  TimeInvested
} from "@port-of-mars/server/rooms/game/events";
import {BotControlTaken} from "@port-of-mars/server/rooms/game/events";

export class SimpleBot implements Bot {
  elapsed = 0;
  maxInactivityTime = 15;
  active = false;

  constructor(public actor: ActorRunner) {}

  static fromActor() {
    return new SimpleBot(new ActorRunner());
  }

  incrementElapsed() {
    this.elapsed += 1;
  }

  resetElapsed() {
    this.elapsed = 0;
  }

  get shouldBeActive(): boolean {
    return this.elapsed >= this.maxInactivityTime;
  }

  act(state: GameState, player: Player): Array<GameEvent> {
    this.incrementElapsed();
    if (this.active) {
      if (this.shouldBeActive) {
        return this.actor[state.phase](state, player);
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

export class ActorRunner implements Actor {
  [Phase.events](state: GameState, player: Player): Array<GameEvent> {
    return []
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
      const trade = state.tradeSet[id];
      if (trade.to.role === player.role) {
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

export type Actor = { [phase in Phase]: (state: GameState, player: Player) => Array<GameEvent> }