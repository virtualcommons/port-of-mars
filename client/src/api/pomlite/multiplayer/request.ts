import { Room } from "colyseus.js";
import { Invest, LiteGameRequest } from "@port-of-mars/shared/lite";

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

  public invest(systemHealthInvestment: number) {
    const msg: Invest = {
      kind: "invest",
      systemHealthInvestment,
    };
    this.send(msg);
  }

  public playerReady() {
    const msg: LiteGameRequest = {
      kind: "player-ready",
    };
    this.send(msg);
  }
}
