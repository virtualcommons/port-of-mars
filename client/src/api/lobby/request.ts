import { Room } from "colyseus.js";
import { AjaxRequest } from "@port-of-mars/client/plugins/ajax";
import {
  LobbyRequest,
  AcceptInvitation,
  StartWithBots,
  VoteStartWithBots,
  StartSoloWithBots,
  SendLobbyChatMessage,
} from "@port-of-mars/shared/lobby/requests";
import { url } from "@port-of-mars/client/util";
import { GameType } from "@port-of-mars/shared/types";

export class LobbyRequestAPI {
  constructor(public ajax: AjaxRequest) {}

  room!: Room;

  connect(room: Room) {
    this.room = room;
  }

  public leave() {
    if (this.room) {
      this.room.leave();
    }
  }

  public async hasActiveGame(type?: GameType) {
    try {
      const params = type ? `?type=${type}` : "";
      return await this.ajax.get(url(`/game/has-active${params}`), ({ data }) => {
        return data;
      });
    } catch (e) {
      console.log("Unable to query active game status");
      console.log(e);
      throw e;
    }
  }

  public send(req: LobbyRequest) {
    this.room.send(req.kind, req);
  }

  public acceptInvitation() {
    const msg: AcceptInvitation = { kind: "accept-invitation" };
    this.send(msg);
  }

  public sendChatMessage(message: string) {
    const msg: SendLobbyChatMessage = {
      kind: "send-lobby-chat-message",
      value: message,
    };
    this.send(msg);
  }
}

export class FreePlayLobbyRequestAPI extends LobbyRequestAPI {
  public startWithBots() {
    const msg: StartWithBots = { kind: "start-with-bots" };
    this.send(msg);
  }

  public startSoloWithBots() {
    const msg: StartSoloWithBots = { kind: "start-solo-with-bots" };
    this.send(msg);
  }

  public voteStartWithBots(vote: boolean) {
    const msg: VoteStartWithBots = {
      kind: "vote-start-with-bots",
      value: vote,
    };
    this.send(msg);
  }
}

export class TournamentLobbyRequestAPI extends LobbyRequestAPI {}

export class ClassroomLobbyRequestAPI extends LobbyRequestAPI {}
