import * as _ from 'lodash';
import {
  Role,
  ROLES,
  CURATOR,
  ENTREPRENEUR,
  PIONEER,
  POLITICIAN,
  RESEARCHER
} from 'shared/types';
import { MarsEvent, MarsEventDeckSerialized, GameState } from '@/rooms/game/state';
import { Schema } from '@colyseus/schema';
import { eventNames } from 'cluster';
import { mediumaquamarine } from 'color-name';
import { Game } from '@/entity/Game';

export function getAllMarsEvents() {
  return marsEvents;
}

const expandCopies = (marsEventsCollection: Array<MarsEvent>) =>
  _.flatMap(marsEventsCollection, (event: MarsEvent) => {
    const copies = event.copies;
    return _.map(_.range(copies), i => _.cloneDeep(event));
  });

class PersonalGain extends Schema implements MarsEvent {
  public static eventData = {
    name: 'Personal Gain',
    copies: 5,
    effect: `Each player secretly chooses Yes or No. Then, simultaneously, players reveal their choice. Players who chose yes gain 6 extra Time Blocks this round, but destroy 6 Upkeep.`,
    flavorText: `It's easy to take risks when others are incurring the costs.`,
    clientViewHandler: 'VOTE_YES_NO' as const,
    duration: 1
  };

  name = PersonalGain.eventData.name;
  copies = PersonalGain.eventData.copies;
  effect = PersonalGain.eventData.effect;
  flavorText = PersonalGain.eventData.flavorText;
  clientViewHandler = PersonalGain.eventData.clientViewHandler;
  duration = PersonalGain.eventData.duration;

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
    if(elapsed === this.duration) {
      return true;
    } else {
      return false;
    }
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

  toJSON(): MarsEvent {
    return new PersonalGain();
  }
}

class MarsEventsDeck {
  deck: Array<MarsEvent>;
  position: number;

  constructor() {
    this.deck =_.shuffle(_.clone(expandCopies(getAllMarsEvents())));
    this.position = 0;
  }

  fromJSON(data: MarsEventDeckSerialized) {
    this.deck.splice(0, this.deck.length, ...data.deck);
    this.position = data.position;
  }

  toJSON(): {deck: Array<MarsEvent>, position: number} {
    return {
      deck: this.deck,
      position: this.position
    }
  }

  updatePosition(cardsUsed: number): void {
    this.position = (this.position + cardsUsed) % this.deck.length;
  }

  public peek(upkeep: number): Array<MarsEvent> {
    const nCardsToDraw = upkeep < 33 ? 3 : upkeep < 67 ? 2 : 1;
    const cardsInds = _.map(_.range(this.position, this.position + nCardsToDraw), ind => ind % this.deck.length);
    return _.map(cardsInds, ind => this.deck[ind]);
  }

  public drawAmount(amount: number): Array<MarsEvent> | undefined {
    return undefined;
  }
}

const marsEvents = [new PersonalGain()];

export { PersonalGain, MarsEventsDeck };
