<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 backdrop">
    <div class="h-100 w-100 d-flex flex-column">
      <Messages class="p-3"></Messages>
      <b-row class="h-100 w-100 mx-auto flex-grow-1 p-5" style="max-width: 1400px">
        <b-col cols="4">
          <HelpPanel></HelpPanel>
        </b-col>
        <b-col cols="8">
          <b-row class="h-100 w-100" no-gutters>
            <b-col cols="7">
              <div id="rooms" class="h-100 content-container mr-3">
                <b-table
                  dark
                  sticky-header
                  class="h-100 m-0 custom-table"
                  style="max-height: none"
                  :fields="clientFields"
                  :items="clients"
                >
                  <template #cell(username)="data">
                    <b-icon-person-fill></b-icon-person-fill> {{ data.item.username }}
                  </template>
                  ></b-table
                >
              </div>
            </b-col>
            <b-col cols="5">
              <div id="actions" class="h-100 pl-3 d-flex flex-column">
                <h4>Port of Mars Tournament Lobby</h4>
                <p>A game will launch as soon as the waiting room fills up with 5 players.</p>
                <h4 class="mt-3">Room Chat</h4>
                <div class="flex-grow-1 content-container">
                  <LobbyChat :messages="chatMessages"></LobbyChat>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Provide, Inject, Vue } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { applyLobbyResponses } from "@port-of-mars/client/api/lobby/response";
import { TournamentLobbyRequestAPI } from "@port-of-mars/client/api/lobby/request";
import { AccountAPI } from "@port-of-mars/client/api/account/request";
import { TOURNAMENT_LOBBY_NAME } from "@port-of-mars/shared/lobby";
import {
  GAME_PAGE,
  CONSENT_PAGE,
  MANUAL_PAGE,
  TOURNAMENT_DASHBOARD_PAGE,
} from "@port-of-mars/shared/routes";
import { Constants } from "@port-of-mars/shared/settings";
import Countdown from "@port-of-mars/client/components/global/Countdown.vue";
import HelpPanel from "@port-of-mars/client/components/lobby/HelpPanel.vue";
import Messages from "@port-of-mars/client/components/global/Messages.vue";
import LobbyChat from "@port-of-mars/client/components/lobby/LobbyChat.vue";

@Component({
  components: {
    Countdown,
    HelpPanel,
    Messages,
    LobbyChat,
  },
})
export default class TournamentLobby extends Vue {
  @Inject() readonly $client!: Client;
  // @Provide() api: TournamentLobbyRequestAPI = new TournamentLobbyRequestAPI(this.$ajax);
  // accountApi!: AccountAPI;

  game = { name: GAME_PAGE };
  dashboard = { name: TOURNAMENT_DASHBOARD_PAGE };
  manual = { name: MANUAL_PAGE };
  consent = { name: CONSENT_PAGE };

  clientFields = [{ key: "username", label: "Player" }];

  get constants() {
    return Constants;
  }

  get clients() {
    // mocked clients for UI building
    return [
      { username: "Player 1", id: 1, dateJoined: new Date().getTime() },
      { username: "Player 2", id: 2, dateJoined: new Date().getTime() },
      { username: "Player 3", id: 3, dateJoined: new Date().getTime() },
      { username: "Player 4", id: 4, dateJoined: new Date().getTime() },
      { username: "Player 5", id: 5, dateJoined: new Date().getTime() },
      { username: "Player 6", id: 6, dateJoined: new Date().getTime() },
      { username: "Player 7", id: 7, dateJoined: new Date().getTime() },
      { username: "Player 8", id: 8, dateJoined: new Date().getTime() },
      { username: "Player 9", id: 9, dateJoined: new Date().getTime() },
      { username: "Player 10", id: 10, dateJoined: new Date().getTime() },
    ];
    // return this.$tstore.state.lobby.clients;
  }

  get chatMessages() {
    return [];
    // return this.$tstore.state.lobby.chat;
  }

  // async created() {
  //   const hasActiveGame = await this.api.hasActiveGame("tournament");
  //   if (hasActiveGame) {
  //     this.$router.push(this.game);
  //     return;
  //   }
  //   try {
  //     const room = await this.$client.joinOrCreate(TOURNAMENT_LOBBY_NAME);
  //     applyLobbyResponses(room, this, "tournament");
  //     this.api.connect(room);
  //   } catch (e) {
  //     this.$router.push(this.dashboard);
  //   }
  // }

  // beforeDestroy() {
  //   this.api.leave();
  //   this.$tstore.commit("RESET_LOBBY_STATE");
  // }
}
</script>

<style lang="scss" scoped></style>
