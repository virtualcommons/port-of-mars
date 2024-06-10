<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 backdrop">
    <div class="mt-5 d-flex flex-grow-1 flex-column align-items-center justify-content-start pt-2">
      <div class="">
        <h1>WELCOME TO THE LOBBY</h1>
        <div class="text-center" style="padding: 1rem">
          <p>Total joined: {{ clients.length }}</p>
          <p>Please wait patiently for your teacher to start game....</p>
          <div v-if="isTeacher" class="start-game-button" style="padding: 1rem">
            <b-button @click="startGame">Start Game</b-button>
          </div>
        </div>
      </div>
      <div class="player-grid">
        <div class="player-card" v-for="client in clients" :key="client.id">
          <span>{{ client.username }}</span>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Provide, Inject, Vue } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { applyLobbyResponses } from "@port-of-mars/client/api/lobby/response";
import { TournamentLobbyRequestAPI } from "@port-of-mars/client/api/lobby/request";
import { EducatorAPI } from "@port-of-mars/client/api/educator/request";
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
export default class ClassroomLobby extends Vue {
  @Inject() readonly $client!: Client;
  // @Provide() api: TournamentLobbyRequestAPI = new TournamentLobbyRequestAPI(this.$ajax);
  educatorApi!: EducatorAPI;

  game = { name: GAME_PAGE };
  dashboard = { name: TOURNAMENT_DASHBOARD_PAGE };
  manual = { name: MANUAL_PAGE };
  consent = { name: CONSENT_PAGE };
  isTeacher = false;
  startGame = {};

  clientFields = [{ key: "username", label: "Player" }];

  get constants() {
    return Constants;
  }

  get clients() {
    // mocked clients for UI building
    return [
      {
        username: "Player 1",
        id: 1,
        dateJoined: new Date().getTime(),
      },
      { username: this.$store.state.user.username, id: 2, dateJoined: new Date().getTime() },
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

  async created() {
    //call to server to find out user's role
    // then add button above for starting game if user is a teacher
    this.educatorApi = new EducatorAPI(this.$store, this.$ajax);
    this.isTeacher = await this.educatorApi.authTeacher();
  }
}
</script>

<style lang="scss" scoped>
.backdrop {
  display: flex;
  flex-direction: column;
  position: relative;
}

.player-count {
  position: absolute; // Absolute positioning to place it on top right
  top: 0;
  right: 0;
  padding: 1rem; // Padding to not stick to the edges
  z-index: 10;
}

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
  justify-content: center;
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
  height: 4rem;
  width: 12rem;
}
</style>
