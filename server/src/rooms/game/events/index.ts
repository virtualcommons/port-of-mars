import { uuid } from 'uuidv4';
import {
  AccomplishmentData,
  ChatMessageData,
  InvestmentData,
  Phase,
  Role,
  TradeData,
  Resource
} from 'shared/types';
import {
  ChatMessage,
  GameState,
  Player,
  Trade,
  MarsLogMessage
} from '@/rooms/game/state';
import { GameEvent } from '@/rooms/game/events/types';
import { MarsEvent } from '@/rooms/game/state/marsEvents/MarsEvent';
import { CompulsivePhilanthropy, PersonalGain, 
        OutOfCommissionCurator, OutOfCommissionPolitician, 
        OutOfCommissionResearcher, OutOfCommissionPioneer,
        OutOfCommissionEntrepreneur, BondingThroughAdversity, BreakdownOfTrust
       } 
        from '@/rooms/game/state/marsEvents/state';
import * as entities from '@/entity/GameEvent';
import {tradeCanBeCompleted} from "shared/validation";
import _ from "lodash";

class GameEventDeserializer {
  protected lookups: { [classname: string]: { new(data?: any): GameEvent }} = {};

  register(event: { new(data: any): GameEvent }) {
    this.lookups[_.kebabCase(event.name)] = event;
  }

  deserialize(ge: entities.GameEvent) {
    const constructor = this.lookups[ge.type];
    return new constructor(ge.payload);
  }
}
export const gameEventDeserializer = new GameEventDeserializer();

abstract class GameEventWithData implements GameEvent {
  abstract data: object;
  dateCreated: number;

  constructor() {
    this.dateCreated = new Date().getTime();
  }

  abstract apply(game: GameState): void;

  get kind() {
    return _.kebabCase(this.constructor.name);
  }

  serialize() {
    return {
      kind: this.kind,
      data: this.data,
      dateCreated: this.dateCreated
    };
  }
}

export class SetPlayerReadiness extends GameEventWithData {
  constructor(public data: { value: boolean; role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].updateReadiness(this.data.value);
  }
}
gameEventDeserializer.register(SetPlayerReadiness);

export class SentChatMessage extends GameEventWithData {
  constructor(public data: ChatMessageData) {
    super();
  }

  apply(game: GameState) {
    game.messages.push(new ChatMessage(this.data));
  }
}
gameEventDeserializer.register(SentChatMessage);

export class BoughtAccomplishment extends GameEventWithData {
  constructor(public data: { accomplishment: AccomplishmentData; role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].buyAccomplishment(this.data.accomplishment);
  }
}
gameEventDeserializer.register(BoughtAccomplishment);

export class DiscardedAccomplishment extends GameEventWithData {
  constructor(public data: { id: number; role: Role }) {
    super();
  }

  apply(game: GameState): void {
    const accomplishmentData = game.players[this.data.role].accomplishments;
    accomplishmentData.discard(this.data.id);
  }
}
gameEventDeserializer.register(DiscardedAccomplishment);

export class TimeInvested extends GameEventWithData {
  constructor(public data: { investment: InvestmentData; role: Role }) {
    super();
  }

  apply(game: GameState): void {
    game.players[this.data.role].pendingInvestments.fromJSON(
      this.data.investment
    );
  }
}
gameEventDeserializer.register(TimeInvested);

export class AcceptTradeRequest extends GameEventWithData {
  constructor(public data: { id: string }) {
    super();
    this.dateCreated = new Date().getTime();
  }

  apply(game: GameState): void {
    if(tradeCanBeCompleted(game.players[game.tradeSet[this.data.id].from.role as Role].inventory,game.tradeSet[this.data.id].from.resourceAmount)){
      let toMsg: Array<string> = [];
      for (const [resource, amount] of Object.entries(
        game.tradeSet[this.data.id].to.resourceAmount
      ) as any) {
        if (amount > 0) {
          toMsg.push(`${amount} ${resource}`);
        }
      }
  
      let fromMsg: Array<string> = [];
      for (const [resource, amount] of Object.entries(
        game.tradeSet[this.data.id].from.resourceAmount
      ) as any) {
        if (amount > 0) {
          fromMsg.push(`${amount} ${resource}`);
        }
      }
  
      const log = new MarsLogMessage({
        performedBy: game.tradeSet[this.data.id].from.role,
        category: 'Trade',
        content: `The ${
          game.tradeSet[this.data.id].from.role
        } has traded ${fromMsg.join(', ')} in exchange for ${toMsg.join(
          ', '
        )} from the ${game.tradeSet[this.data.id].to.role}`,
        timestamp: this.dateCreated
      });
  
      const trade: Trade = game.tradeSet[this.data.id];
      trade.apply(game);
      game.logs.push(log);
    }
    else{
      game.players[game.tradeSet[this.data.id].to.role as Role].sendNotifcation('Trade partner cannot fulful trade.');
      game.players[game.tradeSet[this.data.id].from.role as Role].sendNotifcation('A trade you cannot fulful has been deleted.');
    }
    delete game.tradeSet[this.data.id];
  }
}
gameEventDeserializer.register(AcceptTradeRequest);

export class RejectTradeRequest extends GameEventWithData {
  constructor(public data: { id: string }) {
    super();
  }

  apply(game: GameState): void {
    
    //game.players[game.tradeSet[this.data.id].from.role as Role].pendingInvestments.rollback(game.tradeSet[this.data.id].from.resourceAmount);

    delete game.tradeSet[this.data.id];

  }
}
gameEventDeserializer.register(RejectTradeRequest);

export class SentTradeRequest extends GameEventWithData {
  constructor(public data: TradeData) {
    super();
  }

  apply(game: GameState): void {
    const id = uuid();
    game.tradeSet[id] = new Trade(this.data.from, this.data.to);

    game.players[this.data.to.role as Role].sendNotifcation(`The ${this.data.from.role} would like to trade!`);
    game.players[this.data.from.role as Role].sendNotifcation(`Your trade to ${this.data.to.role} has been received!`);
    //game.players[this.data.from.role].pendingInvestments.add({...this.data.from.resourceAmount,upkeep:0});
  }
}
gameEventDeserializer.register(SentTradeRequest);

export class DeleteNotification extends GameEventWithData {
  constructor(public data: {index:number, player:Player}){super();}

  apply(game: GameState): void {
    this.data.player.deleteNotifcation(this.data.index);
  }
}
gameEventDeserializer.register(DeleteNotification);

/*
 Phase Events
 */

abstract class KindOnlyGameEvent implements GameEvent {
  dateCreated: number;

  constructor(data?: any) {
    this.dateCreated = new Date().getTime();
  }

  get kind(): string {
    return _.kebabCase(this.constructor.name);
  }

  abstract apply(game: GameState): void;

  serialize() {
    return { kind: this.kind, dateCreated: new Date().getTime() };
  }
}

export class MarsEventFinalized extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.currentEvent.state.finalize(game);
  }
}
gameEventDeserializer.register(MarsEventFinalized);

export class MarsEventInitialized extends KindOnlyGameEvent {
  apply(game: GameState): void {
    if(game.currentEvent.state.initialize){
      game.currentEvent.state.initialize(game);
    }
    
  }
}

export class EnteredMarsEventPhase extends KindOnlyGameEvent {

  apply(game: GameState): void {
    game.phase = Phase.events;
    game.round += 1;
    game.upkeep = game.nextRoundUpkeep();

    game.resetPlayerReadiness();
    game.resetPlayerContributedUpkeep();
    game.refreshPlayerPurchasableAccomplisments();

    const cards = game.marsEventDeck.peek(game.upkeep);
    const marsEvents = cards.map(e => new MarsEvent(e));

    game.phase = Phase.events;
    
    game.timeRemaining = marsEvents[0].timeDuration;

    // handle incomplete events
    game.handleIncomplete();
    game.marsEvents.push(...marsEvents);

    game.updateMarsEventsElapsed();
    game.marsEventsProcessed = GameState.DEFAULTS.marsEventsProcessed;
    game.marsEventDeck.updatePosition(game.marsEvents.length);
    // game.logs.push(log);

    for (const player of game.players) {
      player.refreshPurchasableAccomplishments();
      player.resetTimeBlocks();
    }

    // TODO: HANDLE CURRENT EVENT USING MARSEVENTSPROCESSED
  }
}
gameEventDeserializer.register(EnteredMarsEventPhase);

export class ReenteredMarsEventPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.marsEventsProcessed += 1;
    game.timeRemaining = game.marsEvents[game.marsEventsProcessed].timeDuration;
  }
}
gameEventDeserializer.register(ReenteredMarsEventPhase);

export class EnteredInvestmentPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.phase = Phase.invest;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
  }
}
gameEventDeserializer.register(EnteredInvestmentPhase);

export class EnteredTradePhase extends KindOnlyGameEvent {
  apply(game: GameState) {
    game.resetPlayerReadiness();
    game.phase = Phase.trade;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
    for (const player of game.players) {
      //if you want the default action:
      //player.invest(undefined,player.getLeftOverInvestments());

      player.invest();
      player.pendingInvestments.reset();
    }
  }
}
gameEventDeserializer.register(EnteredTradePhase);

export class EnteredPurchasePhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.phase = Phase.purchase;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
    game.clearTrades();
    for (const player of game.players) {
      player.pendingInvestments.reset();
    }
  }
}
gameEventDeserializer.register(EnteredPurchasePhase);

export class EnteredDiscardPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.resetPlayerReadiness();
    game.phase = Phase.discard;
    game.timeRemaining = GameState.DEFAULTS.timeRemaining;
  }
}
gameEventDeserializer.register(EnteredDiscardPhase);

export class EnteredDefeatPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.phase = Phase.defeat;
  }
}
gameEventDeserializer.register(EnteredDefeatPhase);

export class EnteredVictoryPhase extends KindOnlyGameEvent {
  apply(game: GameState): void {
    game.phase = Phase.victory;
    game.evaluateGameWinners();
  }
}
gameEventDeserializer.register(EnteredVictoryPhase);

export class StateSnapshotTaken implements GameEvent {
  kind = 'state-snapshot-taken';
  dateCreated: number;

  constructor(public data: object) {
    this.dateCreated = new Date().getTime();
  }

  apply(game: GameState): void {}

  serialize(): { kind: string; data?: object; dateCreated: number } {
    return {
      kind: this.kind,
      data: this.data,
      dateCreated: new Date().getTime()
    };
  }
}
gameEventDeserializer.register(StateSnapshotTaken);

export class PersonalGainVoted extends GameEventWithData {
  constructor(public data: { role: Role; vote: boolean }) {
    super();
  }

  apply(game: GameState) {
    if (game.currentEvent.state instanceof PersonalGain) {
      const state = game.currentEvent.state;
      state.updateVotes(this.data.role, this.data.vote);
      game.players[this.data.role].updateReadiness(true);
    }
  }
}
gameEventDeserializer.register(PersonalGainVoted);

export class VotedForPhilanthropist extends GameEventWithData {
  constructor(public data: { voter: Role, vote: Role }) {
    super();
  }

  apply(game: GameState): void {
    let state: CompulsivePhilanthropy;
    if (game.currentEvent.state instanceof CompulsivePhilanthropy) {
      state = game.currentEvent.state;
    } else {
      return;
    }

    state.voteForPlayer(this.data.voter, this.data.vote);
    game.players[this.data.voter].updateReadiness(true);
  }
}
gameEventDeserializer.register(VotedForPhilanthropist);

export class CommissionCurator extends GameEventWithData {
  constructor(public data: {role: Role}) {
    super();
  }

  apply(game: GameState): void {
    let state: OutOfCommissionCurator;
    if (game.currentEvent.state instanceof OutOfCommissionCurator) {
      state = game.currentEvent.state;
    } else {
      return;
    }

    state.playerOutOfCommission(this.data.role);
    game.players[this.data.role].updateReadiness(true);
  }
}
gameEventDeserializer.register(CommissionCurator);

export class CommissionPolitician extends GameEventWithData {
  constructor(public data: {role: Role}) {
    super();
  }

  apply(game: GameState): void {
    let state: OutOfCommissionPolitician;
    if (game.currentEvent.state instanceof OutOfCommissionPolitician) {
      state = game.currentEvent.state;
    } else {
      return;
    }

    state.playerOutOfCommission(this.data.role);
    game.players[this.data.role].updateReadiness(true);
  }
}
gameEventDeserializer.register(CommissionPolitician);

export class CommissionResearcher extends GameEventWithData {
  constructor(public data: {role: Role}) {
    super();
  }

  apply(game: GameState): void {
    let state: OutOfCommissionResearcher;
    if (game.currentEvent.state instanceof OutOfCommissionResearcher) {
      state = game.currentEvent.state;
    } else {
      return;
    }

    state.playerOutOfCommission(this.data.role);
    game.players[this.data.role].updateReadiness(true);
  }
}
gameEventDeserializer.register(CommissionResearcher);

export class CommissionPioneer extends GameEventWithData {
  constructor(public data: {role: Role}) {
    super();
  }

  apply(game: GameState): void {
    let state: OutOfCommissionPioneer;
    if (game.currentEvent.state instanceof OutOfCommissionPioneer) {
      state = game.currentEvent.state;
    } else {
      return;
    }

    state.playerOutOfCommission(this.data.role);
    game.players[this.data.role].updateReadiness(true);
  }
}
gameEventDeserializer.register(CommissionPioneer);

export class CommissionEntrepreneur extends GameEventWithData {
  constructor(public data: {role: Role}) {
    super();
  }

  apply(game: GameState): void {
    let state: OutOfCommissionEntrepreneur;
    if (game.currentEvent.state instanceof OutOfCommissionEntrepreneur) {
      state = game.currentEvent.state;
    } else {
      return;
    }

    state.playerOutOfCommission(this.data.role);
    game.players[this.data.role].updateReadiness(true);
  }
}
gameEventDeserializer.register(CommissionEntrepreneur);

export class SelectedInfluence extends GameEventWithData {
  constructor(public data: {role: Role, influence: Resource}) {
    super();
  }

  apply(game: GameState): void {
    let state: BondingThroughAdversity;
    if (game.currentEvent.state instanceof BondingThroughAdversity) {
      state = game.currentEvent.state;
      state.updateVotes(this.data.role, this.data.influence);
      game.players[this.data.role].updateReadiness(true);
    }
  }
}

gameEventDeserializer.register(SelectedInfluence);

export class SaveResources extends GameEventWithData {
  constructor(public data: {role: Role, savedResources: InvestmentData}){
    super();
  }

  apply(game: GameState): void {
    let state: BreakdownOfTrust;
    if(game.currentEvent.state instanceof BreakdownOfTrust){
      state= game.currentEvent.state;
    } else{
      return;
    }
    state.updateSavedResources(this.data.role, game, this.data.savedResources);
    game.players[this.data.role].updateReadiness(true);
  }
}

gameEventDeserializer.register(SaveResources);

