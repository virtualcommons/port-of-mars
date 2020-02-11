import * as _ from 'lodash';
import {
  CURATOR,
  ENTREPRENEUR, EventClientView,
  MarsEventData,
  PIONEER,
  POLITICIAN,
  RESEARCHER,
  Role,
  ROLES
} from 'shared/types';
import {GameState, MarsEventDeckSerialized} from '@/rooms/game/state';
import {ArraySchema, Schema, type} from '@colyseus/schema';

export class MarsEvent extends Schema implements MarsEventData {
  constructor(data: MarsEventData) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.effect = data.effect;
    this.flavorText = data.flavorText;
    this.clientViewHandler = data.clientViewHandler;
    this.duration = data.duration;
    this.state = new PersonalGain();
  }

  @type('string')
  id: string;

  @type('string')
  name: string;

  @type('string')
  effect: string;

  @type('string')
  flavorText: string;

  @type('string')
  clientViewHandler: EventClientView;

  @type('number')
  elapsed: number = 0;

  @type('number')
  duration: number;

  state: { finalize(gameState: GameState): void };

  toJSON(): MarsEventData {
    return {
      ...this
    }
  }

  updateElapsed(): void {
    this.elapsed += 1;
  }

  resetElapsed(): void {
    this.elapsed = 0;
  };

  get complete(): boolean {
    return this.elapsed >= this.duration;
  };
}

export function getAllMarsEvents(): Array<[MarsEventData, number]> {
  return marsEvents;
}

const expandCopies = (marsEventsCollection: Array<[MarsEventData, number]>) =>
  _.flatMap(marsEventsCollection, ([event, copies]: [MarsEventData, number]) => {
    return _.map(_.range(copies), i => _.cloneDeep(event));
  });


// const _map: { [id: string]: { new(): MarsEvent } } = {};
// function addDispatch(constructor: { new(): MarsEvent } & Function) {
//   console.log({constructor});
//   console.log({map: _map});
//   _map[constructor.constructor.name] = constructor;
// }
// export function constructMarsEvent(data: MarsEventData): MarsEvent {
//   return new _map[data.id];
// }
//
// @addDispatch
class PersonalGain {
  public static eventData: MarsEventData = {
    id: 'PersonalGain',
    name: 'Personal Gain',
    effect: `Each player secretly chooses Yes or No. Then, simultaneously, players reveal their choice. Players who chose yes gain 6 extra Time Blocks this round, but destroy 6 Upkeep.`,
    flavorText: `It's easy to take risks when others are incurring the costs.`,
    clientViewHandler: 'VOTE_YES_NO' as const,
    duration: 1
  };

  @type('string')
  id = PersonalGain.eventData.id;

  @type('string')
  name = PersonalGain.eventData.name;

  @type('string')
  effect = PersonalGain.eventData.effect;

  @type('string')
  flavorText = PersonalGain.eventData.flavorText;

  @type('string')
  clientViewHandler = PersonalGain.eventData.clientViewHandler;

  @type('number')
  duration = PersonalGain.eventData.duration;

  @type('number')
  elapsed = 0;

  private static defaultResponse: boolean = true;

  private votes: { [role in Role]: boolean } = {
    [CURATOR]: PersonalGain.defaultResponse,
    [ENTREPRENEUR]: PersonalGain.defaultResponse,
    [PIONEER]: PersonalGain.defaultResponse,
    [POLITICIAN]: PersonalGain.defaultResponse,
    [RESEARCHER]: PersonalGain.defaultResponse
  };

  updateElapsed(elapsed: number): void {
    elapsed += 1;
  }

  resetElapsed(elapsed: number): void {
    elapsed = 0;
  }

  complete(elapsed: number): boolean {
    return elapsed === this.duration;
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
    // game.logs.push(message)
  }

  toJSON(): MarsEventData {
    return { id: this.id, ...PersonalGain.eventData };
  }
}

class MarsEventsDeck {
  deck: Array<MarsEventData>;
  position: number;

  constructor() {
    this.deck =_.shuffle(_.clone(expandCopies(getAllMarsEvents())));
    this.position = 0;
  }

  fromJSON(data: MarsEventDeckSerialized) {
    this.deck.splice(0, this.deck.length, ...data.deck);
    this.position = data.position;
  }

  toJSON(): {deck: Array<MarsEventData>, position: number} {
    return {
      deck: this.deck,
      position: this.position
    }
  }

  updatePosition(cardsUsed: number): void {
    this.position = (this.position + cardsUsed) % this.deck.length;
  }

  public peek(upkeep: number): Array<MarsEventData> {
    const nCardsToDraw = upkeep < 33 ? 3 : upkeep < 67 ? 2 : 1;
    const cardsInds = _.map(_.range(this.position, this.position + nCardsToDraw), ind => ind % this.deck.length);
    return _.map(cardsInds, ind => this.deck[ind]);
  }
}

const marsEvents: Array<[MarsEventData, number]> = [[PersonalGain.eventData, 5]];

export { PersonalGain, MarsEventsDeck };
