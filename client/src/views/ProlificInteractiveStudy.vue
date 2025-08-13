<template>
  <div class="backdrop d-flex flex-column justify-content-center align-items-center">
    <b-alert v-if="started" variant="info" show dismissible>
      <small>
        <p>
          This is an interactive multiplayer study. You will be working collaboratively with other
          participants to make decisions that affect the group outcome.
        </p>
        <p class="mb-0">
          If you are disconnected for any reason during the study, you will be able to rejoin by
          returning to this page
        </p>
      </small>
    </b-alert>
    <b-container class="h-100 dashboard-container content-container p-0" no-gutters>
      <div v-if="joinFailureReason" class="text-center p-5">
        <p>{{ joinFailureReason }}</p>
      </div>
      <div
        v-if="!started && lobbyRoom"
        class="mt-5 text-center p-5"
        style="max-width: 30rem; margin: auto"
      >
        <p>Waiting for participants to join the interactive study...</p>
        <h4>{{ clients.length }} / {{ requiredPlayers }} Participants</h4>
        <b-progress :value="clients.length" :max="requiredPlayers" animated class="my-3" />
        <small class="text-muted">
          <p>
            This interactive study requires all participants to be present. Please allow time for
            other participants to join. If 5 minutes passes since the last participant joined, you
            will be redirected back to Prolific and compensated for your time.
          </p>
          <p>Please <b>do not</b> refresh this page</p>
        </small>
      </div>

      <div v-else-if="started && state.isWaitingToStart" class="text-center p-5">
        <span class="mb-4 text-left" v-html="state.treatmentParams.instructions"> </span>
        <b-button
          variant="primary"
          class="mt-3"
          :disabled="state.player.isReadyToStart"
          @click="setPlayerReady"
        >
          {{ state.player.isReadyToStart ? "Waiting on others…" : "Start Interactive Study" }}
        </b-button>
        <h5 class="mb-0 mt-3">The study will automatically start in {{ state.timeRemaining }}s</h5>
      </div>

      <Dashboard v-else-if="started && !state.isWaitingToStart && !isGameOver" :state="state" />

      <GameOver
        v-else-if="isGameOver || isStudyComplete"
        :status="completedGameState.status"
        :points="completedGameState.points"
        :round="completedGameState.round"
        :showContinue="isStudyComplete"
        continueText="Return to Prolific"
        :showHighScores="false"
        @continue="handleContinue"
        :victoryText="gameOverText"
        :defeatText="gameOverText"
      />
      <div
        v-else-if="
          !statusLoading &&
          this.participantStatus.status === 'in-progress' &&
          !participantStatus.activeRoomId
        "
      >
        Unfortunately, you were not able to complete the interactive study and your group cannot be
        re-joined.
      </div>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Provide, Vue, Watch } from "vue-property-decorator";
import { Client, Room } from "colyseus.js";
import { cloneDeep } from "lodash";
import { LITE_LOBBY_NAME } from "@port-of-mars/shared/lobby";
import { LiteGameClientState } from "@port-of-mars/shared/lite";
import { LiteLobbyRequestAPI } from "@port-of-mars/client/api/lobby/request";
import { applyLiteLobbyResponses } from "@port-of-mars/client/api/lobby/response";
import { LiteGameRequestAPI } from "@port-of-mars/client/api/pomlite/multiplayer/request";
import {
  DEFAULT_STATE,
  applyMultiplayerGameServerResponses,
} from "@port-of-mars/client/api/pomlite/multiplayer/response";
import { StudyAPI } from "@port-of-mars/client/api/study/request";
import Splash from "@port-of-mars/client/components/lite/multiplayer/Splash.vue";
import Dashboard from "@port-of-mars/client/components/lite/interactive/Dashboard.vue";
import GameOver from "@port-of-mars/client/components/lite/multiplayer/GameOver.vue";
import { ProlificMultiplayerParticipantStatus } from "@port-of-mars/shared/types";

@Component({
  name: "ProlificInteractiveStudy",
  components: { Splash, Dashboard, GameOver },
})
export default class ProlificInteractiveStudy extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() private api = new LiteGameRequestAPI();
  lobbyApi = new LiteLobbyRequestAPI(this.$ajax);
  studyApi = new StudyAPI(this.$store, this.$ajax, "interactive");

  // participant
  participantStatus: ProlificMultiplayerParticipantStatus = {
    status: "not-started",
    startingGameType: "prolificInteractive",
  };
  statusLoading = true;

  // lobby
  lobbyRoom: Room | null = null;
  joinFailureReason = "";
  get clients() {
    return this.$tstore.state.lobby?.clients || [];
  }

  get requiredPlayers() {
    return this.$tstore.state.lobby?.groupSize;
  }

  // game
  gameRoom: Room | null = null;
  started = false;
  state: LiteGameClientState = cloneDeep(DEFAULT_STATE);
  // reflects the game last completed game state which is stored
  // since we reset the state when moving to the next game
  completedGameState = {
    status: "incomplete",
    points: 0,
    round: 0,
  };

  get isStudyComplete() {
    return this.participantStatus.status === "completed";
  }

  get isGameOver() {
    return this.state.status === "victory" || this.state.status === "defeat";
  }

  get gameOverText() {
    return "You have completed the interactive study. Thank you for your participation!";
  }

  @Watch("isGameOver", { immediate: true })
  async onGameOver() {
    if (this.isGameOver) {
      this.completedGameState.status = this.state.status;
      this.completedGameState.points = this.state.player.points;
      this.completedGameState.round = this.state.round;
      await this.fetchParticipantStatus();
    }
  }

  async fetchParticipantStatus() {
    this.statusLoading = true;
    const s = await this.studyApi.getProlificParticipantStatus();
    if (s) this.participantStatus = s as ProlificMultiplayerParticipantStatus;
    this.statusLoading = false;
  }

  async created() {
    await this.fetchParticipantStatus();
    if (this.participantStatus.status === "not-started") {
      await this.joinLobby();
    } else if (this.participantStatus.status === "in-progress") {
      if (this.participantStatus.activeRoomId) {
        // try to re-join active game
        await this.joinGame(this.participantStatus.activeRoomId);
      }
    }
  }

  private async onLobbyLeave() {
    this.lobbyRoom = null;
    this.scheduleReconnect();
  }

  private async onGameLeave() {
    this.gameRoom = null;
    this.scheduleReconnect();
  }

  private reconnectTimeout: number | null = null;
  private isTransitioning = false;

  private async scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    this.reconnectTimeout = setTimeout(async () => {
      this.reconnectTimeout = null;
      this.attemptReconnect();
    }, 10000);
  }

  private async attemptReconnect() {
    // abort if we're already connected
    if (this.lobbyRoom || this.gameRoom) return;
    await this.fetchParticipantStatus();
    if (this.participantStatus.status === "in-progress" && this.participantStatus.activeRoomId) {
      await this.joinGame(this.participantStatus.activeRoomId);
    } else if (this.participantStatus.status === "not-started") {
      await this.joinLobby();
    }
  }

  private async joinLobby() {
    try {
      this.lobbyRoom = await this.$client.joinOrCreate(LITE_LOBBY_NAME, {
        type: this.participantStatus.startingGameType,
      });
      applyLiteLobbyResponses(this.lobbyRoom, this);
      this.lobbyApi.connect(this.lobbyRoom);
      // intercept lobby -> game messages
      this.lobbyRoom.onMessage("removed-client-from-lobby", () => this.transitionToGame());
      this.lobbyRoom.onMessage("join-existing-game", () => this.transitionToGame());
      this.lobbyRoom.onLeave(() => this.onLobbyLeave());
    } catch (error) {
      console.error("Failed to join lobby:", error);
      this.joinFailureReason =
        "Failed to join lobby. Please try refreshing the page. If the problem persists, please contact the researcher with error details and you will be compensated for your time.";
      if (error instanceof Error) {
        this.joinFailureReason += ` Error details: ${error.message}`;
      }
    }
  }

  private async joinGame(roomId: string) {
    try {
      this.gameRoom = await this.$client.joinById(roomId);
      applyMultiplayerGameServerResponses(this.gameRoom, this, this.$tstore.state.user);
      this.api.connect(this.gameRoom);
      this.started = true;
      this.gameRoom.onLeave(() => this.onGameLeave());
    } catch (error) {
      console.error("Failed to join game:", error);
      this.joinFailureReason =
        "Failed to join game. Please try refreshing the page. If the problem persists, please contact the researcher with error details and you will be compensated for your time.";
      if (error instanceof Error) {
        this.joinFailureReason += ` Error details: ${error.message}`;
      }
    }
  }

  private async transitionToGame() {
    this.isTransitioning = true;
    // leave lobby and join the real game room
    await this.lobbyRoom!.leave();
    this.lobbyApi.leave();
    const roomId = this.$ajax.roomId;
    if (!roomId) {
      // schedule a reconnect attempt if roomId is undefined for some reason
      // this will ask the server for an active roomId and join it
      this.isTransitioning = false;
      this.scheduleReconnect();
      return;
    }
    await this.joinGame(roomId);
    // clear timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.isTransitioning = false;
  }

  async handleContinue() {
    try {
      const completionUrl = await this.studyApi.completeProlificStudy();
      window.location.href = completionUrl;
    } catch (err) {
      console.log("prolific study not actually completed");
    }
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
