import {MarsEventData} from "shared/types";
import * as _ from "lodash";
import {MarsEventDeckSerialized} from "@/rooms/game/state";
import {getAllMarsEvents} from "@/data/MarsEvents";
import {expandCopies} from "@/rooms/game/state/marsEvents/common";

class MarsEventsDeck {
  position: number;

  constructor(public deck: Array<MarsEventData>) {
    this.position = 0;
  }

  fromJSON(data: MarsEventDeckSerialized) {
    this.deck.splice(0, this.deck.length, ...data.deck);
    this.position = data.position;
  }

  toJSON(): { deck: Array<MarsEventData>, position: number } {
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

export {MarsEventsDeck};