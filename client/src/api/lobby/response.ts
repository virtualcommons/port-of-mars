import { Room } from "colyseus.js";
import { DataChange, Schema } from "@colyseus/schema";
import { SentInvitation, JoinFailure } from "@port-of-mars/shared/lobby/responses";
import { LobbyChatMessageData, LobbyClientData, LobbyType } from "@port-of-mars/shared/types";
import {
  FREE_PLAY_LOBBY_PAGE,
  GAME_PAGE,
  LITE_LOBBY_PAGE,
  LITE_MULTIPLAYER_GAME_PAGE,
  TOURNAMENT_LOBBY_PAGE,
} from "@port-of-mars/shared/routes";

type Schemify<T> = T & Schema;

function deschemify<T>(s: Schemify<T>): T {
  return s.toJSON() as T;
}

export function applyLobbyResponses(room: Room, component: any, lobbyType: LobbyType) {
  const store = component.$tstore;
  const router = component.$router;

  store.commit("SET_LOBBY_TYPE", lobbyType);

  room.onError((code: number, message?: string) => {
    console.log(`Error ${code} occurred in room: ${message} `);
    alert("sorry, we encountered an error, please try refreshing the page or contact us");
  });

  room.onLeave((code: number) => {
    console.log(`client left the room: ${code}`);
  });

  room.onMessage("join-failure", (msg: JoinFailure) => {
    store.commit("SET_DASHBOARD_MESSAGE", { kind: "warning", message: msg.reason });
    router.push({
      name: lobbyType === "freeplay" ? FREE_PLAY_LOBBY_PAGE : TOURNAMENT_LOBBY_PAGE,
    });
  });

  room.onMessage("sent-invitation", (msg: SentInvitation) => {
    component.$ajax.roomId = msg.roomId;
    // set ready and wait for freeplay, in a tournament we just put them right into a game
    if (lobbyType === "freeplay") {
      store.commit("SET_LOBBY_READINESS", true);
      setTimeout(() => {
        room.send("accept-invitation", { kind: "accept-invitation" });
      }, 5 * 1000);
    } else {
      room.send("accept-invitation", { kind: "accept-invitation" });
    }
  });

  room.onMessage("removed-client-from-lobby", () => {
    router.push({ name: GAME_PAGE });
  });

  room.onMessage("join-existing-game", () => {
    router.push({ name: GAME_PAGE });
  });

  room.state.clients.onAdd = (e: Schemify<LobbyClientData>) => {
    store.commit("ADD_TO_LOBBY_CLIENTS", deschemify(e));
    e.onChange = (changes: DataChange[]) => {
      changes.forEach(change => {
        if (change.field === "ready") {
          store.commit("SET_LOBBY_CLIENT_READINESS", {
            client: deschemify(e),
            ready: change.value,
          });
        }
      });
    };
  };

  room.state.clients.onRemove = (e: Schemify<LobbyClientData>) => {
    store.commit("REMOVE_FROM_LOBBY_CLIENTS", deschemify(e));
  };

  room.state.chat.onAdd = (e: Schemify<LobbyChatMessageData>) => {
    store.commit("ADD_TO_LOBBY_CHAT", deschemify(e));
  };
}

export function applyLiteLobbyResponses(room: Room, component: any) {
  const store = component.$tstore;
  const router = component.$router;

  room.onError((code: number, message?: string) => {
    console.log(`Error ${code} occurred in room: ${message} `);
    alert("sorry, we encountered an error, please try refreshing the page or contact us");
  });

  room.onLeave((code: number) => {
    console.log(`client left the room: ${code}`);
  });

  room.onMessage("join-failure", (msg: JoinFailure) => {
    store.commit("SET_DASHBOARD_MESSAGE", { kind: "warning", message: msg.reason });
    router.push({
      name: LITE_LOBBY_PAGE,
    });
  });

  room.onMessage("sent-invitation", (msg: SentInvitation) => {
    component.$ajax.roomId = msg.roomId;
    room.send("accept-invitation", { kind: "accept-invitation" });
  });

  room.onMessage("removed-client-from-lobby", () => {
    router.push({ name: LITE_MULTIPLAYER_GAME_PAGE });
  });

  room.onMessage("join-existing-game", () => {
    router.push({ name: LITE_MULTIPLAYER_GAME_PAGE });
  });

  room.state.clients.onAdd = (e: Schemify<LobbyClientData>) => {
    store.commit("ADD_TO_LOBBY_CLIENTS", deschemify(e));
    e.onChange = (changes: DataChange[]) => {
      changes.forEach(change => {
        if (change.field === "ready") {
          store.commit("SET_LOBBY_CLIENT_READINESS", {
            client: deschemify(e),
            ready: change.value,
          });
        }
      });
    };
  };

  room.state.clients.onRemove = (e: Schemify<LobbyClientData>) => {
    store.commit("REMOVE_FROM_LOBBY_CLIENTS", deschemify(e));
  };
}
