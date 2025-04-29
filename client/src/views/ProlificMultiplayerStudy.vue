<template>
  <div class="backdrop d-flex flex-column justify-content-center align-items-center">
    <b-container class="h-100 dashboard-container content-container p-0" no-gutters>
      <div v-if="!started" class="text-center p-5">
        <p>Waiting for players to join…</p>
        <h4>{{ clients.length }} / {{ requiredPlayers }} Players</h4>
        <b-progress
          :value="clients.length"
          :max="requiredPlayers"
          animated
          class="mt-3"
          style="max-width: 400px; margin: auto"
        />
      </div>

      <div v-else-if="started && state.isWaitingToStart" class="text-center p-5">
        <p class="mb-4">{{ "temp: add state.treatmentParams.instructions" }}</p>
        <h5>Game starts in {{ state.timeRemaining }}s</h5>
        <b-button
          variant="primary"
          class="mt-3"
          :disabled="state.player.isReadyToStart"
          @click="setPlayerReady"
        >
          {{ state.player.isReadyToStart ? "Waiting on others…" : "I'm Ready" }}
        </b-button>
      </div>

      <Dashboard v-else-if="started && !state.isWaitingToStart && !isGameOver" :state="state" />

      <GameOver
        v-else-if="isGameOver || isStudyComplete"
        :status="state.status"
        :points="state.player.points"
        :round="state.round"
        :showContinue="!isStudyComplete"
        :continueText="isStudyComplete ? 'Return to Prolific' : 'Continue'"
        :showHighScores="false"
        @continue="handleContinue"
        :victoryText="gameOverText"
        :defeatText="gameOverText"
      />
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, Provide, Watch } from "vue-property-decorator";
import { Client, Room } from "colyseus.js";
import { cloneDeep } from "lodash";
import { LITE_LOBBY_NAME } from "@port-of-mars/shared/lobby";
import { LiteGameClientState } from "@port-of-mars/shared/lite";
import { settings } from "@port-of-mars/shared/settings";
import { LiteLobbyRequestAPI } from "@port-of-mars/client/api/lobby/request";
import { applyLiteLobbyResponses } from "@port-of-mars/client/api/lobby/response";
import { LiteGameRequestAPI } from "@port-of-mars/client/api/pomlite/multiplayer/request";
import {
  DEFAULT_STATE,
  applyMultiplayerGameServerResponses,
} from "@port-of-mars/client/api/pomlite/multiplayer/response";
import { StudyAPI } from "@port-of-mars/client/api/study/request";
// import { ProlificMultiplayerParticipantStatus } from "@port-of-mars/shared/types";
import Splash from "@port-of-mars/client/components/lite/multiplayer/Splash.vue";
import Dashboard from "@port-of-mars/client/components/lite/multiplayer/Dashboard.vue";
import GameOver from "@port-of-mars/client/components/lite/multiplayer/GameOver.vue";

@Component({ name: "ProlificMultiplayerStudy", components: { Splash, Dashboard, GameOver } })
export default class ProlificMultiplayerStudy extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() private api = new LiteGameRequestAPI();
  lobbyApi = new LiteLobbyRequestAPI(this.$ajax);
  studyApi = new StudyAPI(this.$store, this.$ajax, "multiplayer");

  // participant
  // participantStatus: ProlificMultiplayerParticipantStatus = {
  //   activeGameType: null,
  //   nextGameType: null,
  //   progress: { current: 0, max: 0, label: "" },
  // };
  statusLoading = true;

  // lobby
  lobbyRoom: Room | null = null;
  get clients() {
    return this.$tstore.state.lobby?.clients || [];
  }

  get requiredPlayers() {
    return settings.LITE_MULTIPLAYER_PLAYERS_COUNT;
  }

  // game
  gameRoom: Room | null = null;
  started = false;
  state: LiteGameClientState = cloneDeep(DEFAULT_STATE);

  get isStudyComplete() {
    return false;
    // FIXME: relies on participant status. this tells us if the user should be given a link
    // return !this.participantStatus.nextGameType && !this.statusLoading;
  }

  get isGameOver() {
    return ["victory", "defeat"].includes(this.state.status);
  }

  get gameOverText() {
    return this.isStudyComplete
      ? "You have completed the study. Thank you for your participation!"
      : "You will be advanced to the next game in a few seconds..";
  }

  // @Watch("isGameOver", { immediate: true })
  // async onGameOver() {
  //   if (this.isGameOver) {
  //     await this.fetchParticipantStatus();
  //   }
  // }

  // async fetchParticipantStatus() {
  //   this.statusLoading = true;
  //   const s = await this.studyApi.getProlificParticipantStatus();
  //   if (s) this.participantStatus = s;
  //   this.statusLoading = false;
  // }

  async created() {
    // as soon as the page loads, join the lobby:
    this.lobbyRoom = await this.$client.joinOrCreate(LITE_LOBBY_NAME);
    applyLiteLobbyResponses(this.lobbyRoom, this);
    this.lobbyApi.connect(this.lobbyRoom);

    // intercept lobby -> game messages
    this.lobbyRoom.onMessage("removed-client-from-lobby", () => this.transitionToGame());
    this.lobbyRoom.onMessage("join-existing-game", () => this.transitionToGame());
  }

  private async transitionToGame() {
    // leave lobby and join the real game room
    await this.lobbyRoom!.leave();
    this.lobbyApi.leave();

    const roomId = this.$ajax.roomId;
    if (!roomId) {
      return console.error("Missing roomId");
    }

    this.gameRoom = await this.$client.joinById(roomId);
    applyMultiplayerGameServerResponses(this.gameRoom, this, this.$tstore.state.user);
    this.api.connect(this.gameRoom);

    this.started = true;
  }

  async handleContinue() {
    // TODO: if isStudyComplete, redirect to prolific with CC
  }

  async setPlayerReady() {
    this.api.playerReady();
  }

  async leaveAll() {
    if (this.lobbyRoom) {
      await this.lobbyRoom.leave();
      this.lobbyApi.leave();
    }
    if (this.gameRoom) {
      await this.gameRoom.leave();
      this.api.reset();
    }
  }

  beforeDestroy() {
    this.leaveAll();
  }
}
</script>

<style lang="scss">
@import "@port-of-mars/client/stylesheets/sologame";
.dashboard-container {
  max-width: 1200px;
  max-height: 700px;
}
</style>
