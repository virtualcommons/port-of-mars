import { Room } from "colyseus.js";
import { EventContinue, Invest, SoloGameRequest } from "@port-of-mars/shared/sologame";

export class SoloGameRequestAPI {
  room!: Room;

  connect(room: Room) {
    this.room = room;
  }

  public leave() {
    if (this.room) {
      this.room.leave();
    }
  }

  public send(req: SoloGameRequest) {
    this.room.send(req.kind, req);
  }

  public eventContinue() {
    const msg: EventContinue = { kind: "event-continue" };
    this.send(msg);
  }

  public invest(systemHealthInvestment: number) {
    const msg: Invest = {
      kind: "invest",
      systemHealthInvestment,
    };
    this.send(msg);
  }
}
