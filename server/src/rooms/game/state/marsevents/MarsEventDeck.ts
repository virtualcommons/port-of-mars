import * as _ from "lodash";
import { MarsEventData } from "@port-of-mars/shared/types";
import { MarsEventDeckSerialized } from "@port-of-mars/server/rooms/game/state";

export default class MarsEventsDeck {
  position: number;

  constructor(public deck: Array<MarsEventData>) {
    this.position = 0;
  }

  fromJSON(data: MarsEventDeckSerialized) {
    this.deck.splice(0, this.deck.length, ...data.deck);
    this.position = data.position;
  }

  toJSON(): { deck: Array<MarsEventData>; position: number } {
    return {
      deck: this.deck,
      position: this.position
    }
  }

  updatePosition(cardsUsed: number): void {
    this.position = (this.position + cardsUsed) % this.deck.length;
  }

  public peek(nCardsToDraw: number): Array<MarsEventData> {
    const cardsInds = _.map(_.range(this.position, this.position + nCardsToDraw), ind => ind % this.deck.length);
    return _.map(cardsInds, ind => this.deck[ind]);
  }
}