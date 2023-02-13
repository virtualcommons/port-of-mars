import { State, defaultLobbyState } from "@port-of-mars/shared/game/client/state";
import { LobbyChatMessageData, LobbyClientData } from "@port-of-mars/shared/types";

export default {
  ADD_TO_LOBBY_CLIENTS(state: State, payload: LobbyClientData) {
    state.lobby.clients.push(payload);
  },

  REMOVE_FROM_LOBBY_CLIENTS(state: State, payload: LobbyClientData) {
    const index = state.lobby.clients.findIndex((c: any) => c.id === payload.id);
    if (index > -1) {
      state.lobby.clients.splice(index, 1);
    }
  },

  SET_LOBBY_READINESS(state: State, payload: boolean) {
    state.lobby.ready = payload;
  },

  SET_LOBBY_CLIENT_READINESS(state: State, payload: { client: LobbyClientData; ready: boolean }) {
    const index = state.lobby.clients.findIndex((c: any) => c.id === payload.client.id);
    if (index > -1) {
      state.lobby.clients[index].ready = payload.ready;
    }
  },

  ADD_TO_LOBBY_CHAT(state: State, payload: LobbyChatMessageData) {
    state.lobby.chat.push(payload);
  },

  SET_LOBBY_READY(state: State, payload: boolean) {
    state.lobby.ready = payload;
  },

  SET_LOBBY_DATE_CREATED(state: State, payload: number) {
    state.lobby.dateCreated = payload;
  },

  RESET_LOBBY_STATE(state: State) {
    console.log(defaultLobbyState().clients);
    state.lobby = defaultLobbyState();
  },
};
