import { Room } from "colyseus.js";
import { Invest, LiteGameRequest, SendChatMessage, SubmitVote } from "@port-of-mars/shared/lite";
import { Role } from "@port-of-mars/shared/types";

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

  public sendChatMessage(message: string) {
    const msg: SendChatMessage = {
      kind: "send-chat-message",
      message,
    };
    this.send(msg);
  }

  public submitVote(vote: { binaryVote?: boolean; roleVote?: Role }) {
    console.log("Submitting vote:", vote);
    const msg: SubmitVote = {
      kind: "submit-vote",
      binaryVote: vote.binaryVote,
      roleVote: vote.roleVote,
    };
    console.log("Sending vote message:", msg);
    this.send(msg);
  }
}
