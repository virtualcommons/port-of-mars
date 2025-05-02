<template>
  <div class="backdrop d-flex flex-column justify-content-center align-items-center">
    <b-alert v-if="started" variant="warning" show dismissible>
      <small>
        <p>
          This is a multiplayer game. In order to complete the study you must play through both
          games with your group
        </p>
        <p class="mb-0">
          If you are disconnected for any reason during the game, you will be able to rejoin by
          returning to this page
        </p>
      </small>
    </b-alert>
    <b-container class="h-100 dashboard-container content-container p-0" no-gutters>
      <div
        v-if="!started && lobbyRoom"
        class="mt-5 text-center p-5"
        style="max-width: 30rem; margin: auto"
      >
        <p>Waiting for players to join..</p>
        <h4>{{ clients.length }} / {{ requiredPlayers }} Players</h4>
        <b-progress :value="clients.length" :max="requiredPlayers" animated class="my-3" />
        <small class="text-muted">
          <p>
            Since the game portion of this study is multiplayer, please allow for some time for
            other participants to join. If a group doesn't form in
            {{ LOBBY_WAIT_LIMIT_MINUTES }} minutes, you'll be redirected back to Prolific and
            compensated for your time.
          </p>
          <p>Please <b>do not</b> refresh this page</p>
        </small>
      </div>

      <div v-else-if="started && state.isWaitingToStart" class="text-center p-5">
        <span class="mb-4" v-html="state.treatmentParams.instructions"> </span>
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
        :status="completedGameState.status"
        :points="completedGameState.points"
        :round="completedGameState.round"
        :showContinue="isStudyComplete"
        :continueText="isStudyComplete ? 'Return to Prolific' : 'Continue'"
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
        Unfortunately, you were not able to complete the game portion of the study and your group
        cannot be re-joined.
      </div>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, Provide, Watch } from "vue-property-decorator";
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
import Dashboard from "@port-of-mars/client/components/lite/multiplayer/Dashboard.vue";
import GameOver from "@port-of-mars/client/components/lite/multiplayer/GameOver.vue";
import { ProlificMultiplayerParticipantStatus } from "@port-of-mars/shared/types";

@Component({ name: "ProlificMultiplayerStudy", components: { Splash, Dashboard, GameOver } })
export default class ProlificMultiplayerStudy extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() private api = new LiteGameRequestAPI();
  lobbyApi = new LiteLobbyRequestAPI(this.$ajax);
  studyApi = new StudyAPI(this.$store, this.$ajax, "multiplayer");

  // participant
  participantStatus: ProlificMultiplayerParticipantStatus = {
    status: "not-started",
  };
  statusLoading = true;

  // lobby
  LOBBY_WAIT_LIMIT_MINUTES = 5;
  lobbyRoom: Room | null = null;
  lobbyTImeoutId: number | null = null;
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
    return ["victory", "defeat"].includes(this.state.status);
  }

  get gameOverText() {
    return this.isStudyComplete
      ? "You have completed the study. Thank you for your participation!"
      : "You will be advanced to the next game in a few seconds..";
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

  private async joinLobby() {
    this.lobbyRoom = await this.$client.joinOrCreate(LITE_LOBBY_NAME, { type: "prolificBaseline" });
    applyLiteLobbyResponses(this.lobbyRoom, this);
    this.lobbyApi.connect(this.lobbyRoom);

    this.startLobbyTimeout();

    // intercept lobby -> game messages
    this.lobbyRoom.onMessage("removed-client-from-lobby", () => this.transitionToGame());
    this.lobbyRoom.onMessage("join-existing-game", () => this.transitionToGame());
  }

  private async joinGame(roomId: string) {
    this.gameRoom = await this.$client.joinById(roomId);
    applyMultiplayerGameServerResponses(this.gameRoom, this, this.$tstore.state.user);
    this.api.connect(this.gameRoom);
    this.started = true;
  }

  private startLobbyTimeout() {
    if (this.lobbyTImeoutId !== null) return;
    this.lobbyTImeoutId = window.setTimeout(async () => {
      // be extra safe, make sure the game isn't running
      if (this.gameRoom || this.started) {
        return;
      }
      const completionUrl = await this.studyApi.completeProlificStudy();
      window.location.href = completionUrl;
    }, this.LOBBY_WAIT_LIMIT_MINUTES * 60 * 1000);
  }

  private clearLobbyTimeout() {
    if (this.lobbyTImeoutId !== null) {
      clearTimeout(this.lobbyTImeoutId);
      this.lobbyTImeoutId = null;
    }
  }

  private async transitionToGame() {
    // leave lobby and join the real game room
    await this.lobbyRoom!.leave();
    this.lobbyApi.leave();
    this.clearLobbyTimeout();
    const roomId = this.$ajax.roomId;
    if (!roomId) {
      return console.error("Missing roomId");
    }
    await this.joinGame(roomId);
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
      this.clearLobbyTimeout();
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
