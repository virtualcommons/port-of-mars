<template>
  <div class="backdrop d-flex flex-column justify-content-center align-items-center">
    <b-progress
      class="w-100 mb-5 bg-dark"
      style="max-width: 1200px"
      height="2rem"
      :max="participantStatus.progress.max"
      variant="success"
    >
      <b-progress-bar
        class="font-weight-bold"
        :value="participantStatus.progress.current"
        :label="participantStatus.progress.label"
      />
    </b-progress>
    <b-container class="h-100 solo-dashboard-container content-container p-0" no-gutters>
      <Splash
        v-if="!started && !isStudyComplete"
        @begin="begin"
        :gameType="participantStatus.nextGameType"
        :instructions="participantStatus.nextGameInstructions"
      />
      <GameOver
        v-else-if="isGameOver || isStudyComplete"
        :status="state.status"
        :points="state.player.points"
        :round="state.round"
        :continueText="isStudyComplete ? 'Return to Prolific' : 'Continue'"
        :showHighScores="false"
        victoryText=""
        defeatText=""
        @continue="handleContinue"
      />
      <Dashboard v-else :state="state" />
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Component, Inject, Provide } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { cloneDeep } from "lodash";
import { LiteGameRequestAPI } from "@port-of-mars/client/api/pomlite/solo/request";
import { StudyAPI } from "@port-of-mars/client/api/study/request";
import {
  DEFAULT_STATE,
  applySoloGameServerResponses,
} from "@port-of-mars/client/api/pomlite/solo/response";
import { SOLO_ROOM_NAME, SoloGameClientState } from "@port-of-mars/shared/lite";
import Dashboard from "@port-of-mars/client/components/lite/solo/Dashboard.vue";
import GameOver from "@port-of-mars/client/components/lite/solo/GameOver.vue";
import Splash from "@port-of-mars/client/components/lite/solo/Splash.vue";
import { ProlificSoloParticipantStatus } from "@port-of-mars/shared/types";

@Component({
  name: "ProlificSoloStudy",
  components: {
    Dashboard,
    Splash,
    GameOver,
  },
})
export default class ProlificSoloStudy extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() private api: LiteGameRequestAPI = new LiteGameRequestAPI();
  hasApi = false;
  started = false;
  studyApi = new StudyAPI(this.$store, this.$ajax, "solo");

  participantStatus: ProlificSoloParticipantStatus = {
    activeGameType: null,
    nextGameType: null,
    progress: {
      current: 0,
      max: 0,
      label: "",
    },
  };
  statusLoading = true;

  state: SoloGameClientState = cloneDeep(DEFAULT_STATE);

  get isGameOver() {
    return ["victory", "defeat"].includes(this.state.status);
  }

  get isStudyComplete() {
    return (
      !this.participantStatus.nextGameType &&
      !this.participantStatus.activeGameType &&
      !this.statusLoading
    );
  }

  @Watch("isGameOver", { immediate: true })
  async onGameOver() {
    if (this.isGameOver) {
      await this.fetchProlificParticipantStatus();
    }
  }

  async handleContinue() {
    await this.fetchProlificParticipantStatus();
    if (this.participantStatus.nextGameType) {
      this.started = false;
      Object.assign(this.state, cloneDeep(DEFAULT_STATE));
      this.api.reset();
    } else {
      const completionUrl = await this.studyApi.completeProlificStudy();
      window.location.href = completionUrl;
    }
  }

  async begin() {
    try {
      await this.leave();
      await this.fetchProlificParticipantStatus();
      const type = this.participantStatus.activeGameType || this.participantStatus.nextGameType;
      console.log("Creating game room with type", type);
      this.api.room = await this.$client.create(SOLO_ROOM_NAME, { type });
      applySoloGameServerResponses(this.api.room, this);
      this.started = true;
      this.api.room.onMessage("ready", () => {
        this.fetchProlificParticipantStatus();
      });
    } catch (err) {
      console.log("Error creating game room");
      console.error(err);
    }
  }

  async fetchProlificParticipantStatus() {
    this.statusLoading = true;
    const status = await this.studyApi.getProlificParticipantStatus();
    if (status) {
      this.participantStatus = status as ProlificSoloParticipantStatus;
    }
    this.statusLoading = false;
  }

  async created() {
    await this.fetchProlificParticipantStatus();
  }

  destroyed() {
    this.leave();
  }

  async leave() {
    if (this.api.room) await this.api.room.leave();
  }
}
</script>

<style lang="scss">
@import "@port-of-mars/client/stylesheets/sologame";

.solo-dashboard-container {
  max-width: 1200px;
  max-height: 700px;
}
</style>
