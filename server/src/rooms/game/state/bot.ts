import {EventClientView, InvestmentData, Phase, RESOURCES, Role, ROLES} from "@port-of-mars/shared/types";
import {Bot, GameState, Player, Trade} from "@port-of-mars/server/rooms/game/state/index";
import {GameEvent} from "@port-of-mars/server/rooms/game/events/types";
import {
  AcceptedTradeRequest,
  BotControlRelinquished,
  BotControlTaken,
  DiscardedAccomplishment,
  BreakdownOfTrustOccured,
  PurchasedAccomplishment,
  SelectedInfluence,
  SetPlayerReadiness,
  TimeInvested,
  VotedForPersonalGain,
  VotedForPhilanthropist,
  VoteHeroOrPariah,
  VoteHeroOrPariahRole
} from "@port-of-mars/server/rooms/game/events";
import {getLogger} from "@port-of-mars/server/settings";
import _ from "lodash";
import {downCastEventState, HeroOrPariah} from "@port-of-mars/server/rooms/game/state/marsevents/state";

const logger = getLogger(__filename);

function getTopAdversary(state: GameState, player: Player): Player {
  let maxVictoryPoints: number = -1;
  let adversary!: Player;
  for (const p of state.players) {
    if (p.role != player.role) {
      if (p.victoryPoints > maxVictoryPoints) {
        maxVictoryPoints = p.victoryPoints;
        adversary = p;
      }
    }
  }
  return adversary;
}

export type AbstractMarsEventVisitor = { [view in EventClientView]: (state: GameState, player: Player) => Array<GameEvent> };

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
    return [new VotedForPersonalGain({vote: state.systemHealth > 30, role: player.role})]
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

    return [new VotedForPhilanthropist({voter: player.role, vote: role})]
  }

  VOTE_FOR_PLAYER_HERO_PARIAH(state: GameState, player: Player): Array<GameEvent> {
    // 1. check game state: has H or P been decided?
    // if voting for hero or pariah, then local bot player (LBP) select another player randomly

    switch (state.heroOrPariah) {
        // if hero -> make preference for voting for LBP
      case "hero":
        return [new VoteHeroOrPariahRole({role: player.role, vote: player.role})];

        // if pariah -> pick someone else that's not the LBP
      case "pariah":
        return [new VoteHeroOrPariahRole({role: player.role, vote: getTopAdversary(state, player).role})];

        // 2. if not in hero or pariah voting phase 1, LBP submits vote for hero or pariah randomly
      case "": {
        return downCastEventState(HeroOrPariah, state, (eventState) => {
          if (!eventState.hasVoted(player.role)) {
            const choice = _.random(0, 1) ? 'hero' : 'pariah';
            logger.debug('player %s choice %o', player.role, choice);
            return [new VoteHeroOrPariah({role: player.role, heroOrPariah: choice})];
          } else return [];
        }) ?? [];
      }
    }
  }

  INFLUENCES_SELECT(state: GameState, player: Player): Array<GameEvent> {
    const savedResources: InvestmentData = {
      culture: -player.inventory.culture,
      finance: -player.inventory.finance,
      government: -player.inventory.government,
      legacy: -player.inventory.legacy,
      science: -player.inventory.science,
      systemHealth: 0
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
    return [new BreakdownOfTrustOccured({role: player.role, savedResources})]
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
    } else {
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
    const upkeepCost = player.costs['systemHealth'];
    const upkeepUnits = Math.floor((tbs - specialityCost * specialityUnits) / upkeepCost);
    const investment: InvestmentData = {
      culture: 0,
      finance: 0,
      government: 0,
      legacy: 0,
      science: 0,
      systemHealth: upkeepUnits
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
      const trade: Trade = state.tradeSet.get(id)!;
      if (trade.status === 'Active' && trade.recipient.role === player.role) {
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
        // don't purchase screw cards if system health is low
        if (state.systemHealth <= 35 && accomplishment.systemHealth < 0) {
          continue;
        }
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
      if (accomplishment.systemHealth <= 0) {
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
  maxInactivityTime = 300;
  warningTime = 240;
  active = false;

  constructor(public actor: ActorRunner, public player: Player) {
  }

  get shouldBeActive(): boolean {
    return this.elapsed >= this.maxInactivityTime;
  }

  static fromActor(player: Player): SimpleBot {
    return new SimpleBot(new ActorRunner(), player);
  }

  incrementElapsed(): void {
    this.elapsed += 1;
  }

  resetElapsed(): void {
    this.elapsed = 0;
    this.updateBotWarning();
  }

  /**
   * Send warning that bot will take over if player has been inactive for 4 min.
   * @param state The Game State
   */
  updateBotWarning(): void {
    this.player.botWarning = this.elapsed >= this.warningTime;
  }

  act(state: GameState): Array<GameEvent> {
    this.incrementElapsed();
    if (this.active) {
      if (this.shouldBeActive) {
        const events = this.actor[state.phase](state, this.player);
        if (events.length > 0) logger.debug('actor events performed: %o', events);
        return events;
      } else {
        return [new BotControlRelinquished({role: this.player.role})]
      }
    } else {
      if (this.shouldBeActive) {
        return [new BotControlTaken({role: this.player.role})]
      } else {
        this.updateBotWarning();
        return [];
      }
    }
  }
}

export type Actor = { [phase in Phase]: (state: GameState, player: Player) => Array<GameEvent> }