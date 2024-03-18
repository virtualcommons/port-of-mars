<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 backdrop">
    <div class="total-joined text-right">Total joined: {{ clients.length }}</div>
    <div class="d-flex flex-grow-1 flex-column align-items-center justify-content-start pt-2">
      <div class="">
        <h1>WELCOME TO THE LOBBY</h1>
        <div class="text-center">
          <p>Please wait patiently for your teacher to start game....</p>
        </div>
      </div>
      <div class="player-grid">
        <div class="player-card" v-for="client in clients" :key="client.id">
          <span>{{ client.username }}</span>
        </div>
      </div>
    </div>
    <!-- <b-row class="justify-content-between align-items-center mb-2">
      <b-col> </b-col>
      <b-col cols="auto" class="text-right"> Total joined: {{ clients.length }} </b-col>
    </b-row> -->
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

<style lang="scss" scoped>
.backdrop {
  display: flex;
  flex-direction: column;
}

.player-count {
  position: absolute; // Absolute positioning to place it on top right
  top: 0;
  right: 0;
  padding: 1rem; // Padding to not stick to the edges
  z-index: 10; // Ensure it's above other elements
}

.total-joined {
  position: absolute;
  top: 0;
  right: 0;
  padding: 7rem;
  z-index: 10;
}

// .header {
//   text-align: center;
//   background-color: transparent;

//   p {
//     color: #ffffff;
//   }
// }

.player-grid {
  display: grid;

  grid-template-columns: repeat(2, 1fr);

  @media (min-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (min-width: 1600px) {
    grid-template-columns: repeat(5, 1fr);
  }
  grid-gap: 1.5rem;
  width: 100%;
  max-width: 900px;
}

.player-card {
  background-color: #333333;
  border: 3px solid #444444;
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  height: 70px;
  width: 210px;
}
</style>
