import { Room } from "colyseus.js";
import { EventContinue, Invest, LiteGameRequest } from "@port-of-mars/shared/lite";

export class LiteGameRequestAPI {
  room: Room | null = null;

  connect(room: Room) {
    this.room = room;
  }

  reset() {
    this.room = null;
  }

  public leave() {
    if (this.room) {
      this.room.leave();
    }
  }

  public send(req: LiteGameRequest) {
    if (!this.room) {
      throw new Error("room not connected");
    }
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
