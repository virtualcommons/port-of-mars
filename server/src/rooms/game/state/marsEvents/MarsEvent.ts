import {Schema, type} from "@colyseus/schema";
import {EventClientView, MarsEventData} from "shared/types";
import {MarsEventState} from "@/rooms/game/state/marsEvents/common";
import {constructState} from "@/rooms/game/state/marsEvents/state";
import {GameState} from "@/rooms/game/state";

export class MarsEvent extends Schema implements MarsEventData {
  constructor(data: MarsEventData) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.effect = data.effect;
    this.flavorText = data.flavorText;
    this.clientViewHandler = data.clientViewHandler;
    this.duration = data.duration;
    this.state = constructState(data.id);

    //NICK EDIT
    this.timeDuration = data.timeDuration ? data.timeDuration : GameState.DEFAULTS.timeRemaining;
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

  @type('number')
  timeDuration:number;

  state: MarsEventState;

  toJSON(): MarsEventData & { elapsed: number, state: any } {
    const {id, name, effect, flavorText, clientViewHandler, elapsed, duration} = this;
    return {
      id, name, effect, flavorText, clientViewHandler, elapsed, duration, state: this.state.toJSON()
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