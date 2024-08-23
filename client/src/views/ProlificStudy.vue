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
    {{ participantStatus.nextGameType }}
    <b-container class="h-100 solo-dashboard-container content-container p-0" no-gutters>
      <Splash v-if="!started" @begin="begin" />
      <GameOver
        v-else-if="isGameOver"
        :status="state.status"
        :points="state.player.points"
        :round="state.round"
      />
      <Dashboard v-else :state="state" />
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, Provide } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { SoloGameRequestAPI } from "@port-of-mars/client/api/sologame/request";
import { StudyAPI } from "@port-of-mars/client/api/study/request";
import { applySoloGameServerResponses } from "@port-of-mars/client/api/sologame/response";
import { SoloGameClientState, SOLO_ROOM_NAME } from "@port-of-mars/shared/sologame";
import Dashboard from "@port-of-mars/client/components/sologame/Dashboard.vue";
import GameOver from "@port-of-mars/client/components/sologame/GameOver.vue";
import Splash from "@port-of-mars/client/components/sologame/Splash.vue";
import { ProlificParticipantStatus } from "@port-of-mars/shared/types";

@Component({
  name: "ProlificStudy",
  components: {
    Dashboard,
    Splash,
    GameOver,
  },
})
export default class ProlificStudy extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() private api: SoloGameRequestAPI = new SoloGameRequestAPI();
  hasApi = false;
  started = false;
  studyApi = new StudyAPI(this.$store, this.$ajax);

  participantStatus: ProlificParticipantStatus = {
    activeGameType: null,
    nextGameType: null,
    progress: {
      current: 0,
      max: 0,
      label: "",
    },
  };

  state: SoloGameClientState = {
    type: "freeplay",
    status: "incomplete",
    timeRemaining: 0,
    systemHealth: 0,
    round: 0,
    treatmentParams: {
      isNumberOfRoundsKnown: false,
      isEventDeckKnown: false,
      thresholdInformation: "unknown",
      isLowResSystemHealth: false,
    },
    player: {
      resources: 0,
      points: 0,
    },
    visibleEventCards: [],
    activeCardId: -1,
    canInvest: true,
    isRoundTransitioning: false,
  };

  get isGameOver() {
    return ["victory", "defeat"].includes(this.state.status);
  }

  async begin() {
    try {
      await this.leave();
      this.api.room = await this.$client.create(SOLO_ROOM_NAME, {
        type: this.participantStatus.nextGameType,
      });
      applySoloGameServerResponses(this.api.room, this);
      this.started = true;
    } catch (err) {
      console.log("Error creating game room");
      console.error(err);
    }
  }

  async created() {
    this.participantStatus = await this.studyApi.getProlificParticipantStatus();
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
