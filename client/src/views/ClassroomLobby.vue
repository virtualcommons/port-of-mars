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
import { Component, Inject, Vue, Provide } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { EducatorAPI } from "@port-of-mars/client/api/educator/request";
import { GAME_PAGE, MANUAL_PAGE, HOME_PAGE } from "@port-of-mars/shared/routes";
import Countdown from "@port-of-mars/client/components/global/Countdown.vue";
import HelpPanel from "@port-of-mars/client/components/lobby/HelpPanel.vue";
import Messages from "@port-of-mars/client/components/global/Messages.vue";
import LobbyChat from "@port-of-mars/client/components/lobby/LobbyChat.vue";
import { ClassroomLobbyRequestAPI } from "@port-of-mars/client/api/lobby/request";
import { CLASSROOM_LOBBY_NAME } from "@port-of-mars/shared/lobby";
import { applyLobbyResponses } from "../api/lobby/response";

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
  @Provide() api: ClassroomLobbyRequestAPI = new ClassroomLobbyRequestAPI(this.$ajax);
  educatorApi!: EducatorAPI;

  game = { name: GAME_PAGE };
  home = { name: HOME_PAGE };
  manual = { name: MANUAL_PAGE };
  isTeacher = false;
  startGame = {};

  clientFields = [{ key: "username", label: "Player" }];

  get clients() {
    return this.$tstore.state.lobby.clients;
  }

  get chatMessages() {
    return [];
    // FIXME: dont think we'll have a chat in the classroom lobby,
    // can just ignore it in the UI
    // return this.$tstore.state.lobby.chat;
  }

  async created() {
    const hasActiveGame = await this.api.hasActiveGame("classroom");
    if (hasActiveGame) {
      this.$router.push(this.game);
      return;
    }
    try {
      const room = await this.$client.joinOrCreate(CLASSROOM_LOBBY_NAME);
      applyLobbyResponses(room, this, "classroom");
    } catch (e) {
      this.$router.push(this.home);
    }
    // FIXME: do we want this button in here? or on the teacher dashboard, both?
    // call to server to find out user's role
    // then add button above for starting game if user is a teacher
    // this.educatorApi = new EducatorAPI(this.$store, this.$ajax);
    // this.isTeacher = await this.educatorApi.authTeacher();
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
