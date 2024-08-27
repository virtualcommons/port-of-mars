<template>
  <div class="backdrop d-flex justify-content-center align-items-center">
    <b-container class="h-100 solo-dashboard-container content-container p-0" no-gutters>
      <Splash v-if="!started" @begin="begin" />
      <GameOver
        v-else-if="isGameOver"
        :status="state.status"
        :points="state.player.points"
        :round="state.round"
        @continue="handleContinue"
      />
      <Dashboard v-else :state="state" />
    </b-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, Provide } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { SoloGameRequestAPI } from "@port-of-mars/client/api/sologame/request";
import {
  DEFAULT_STATE,
  applySoloGameServerResponses,
} from "@port-of-mars/client/api/sologame/response";
import { SOLO_ROOM_NAME, SoloGameClientState } from "@port-of-mars/shared/sologame";
import Dashboard from "@port-of-mars/client/components/sologame/Dashboard.vue";
import GameOver from "@port-of-mars/client/components/sologame/GameOver.vue";
import Splash from "@port-of-mars/client/components/sologame/Splash.vue";

@Component({
  name: "sologame",
  components: {
    Dashboard,
    Splash,
    GameOver,
  },
})
export default class SoloGame extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() private api: SoloGameRequestAPI = new SoloGameRequestAPI();
  hasApi = false;
  started = false;

  state: SoloGameClientState = { ...DEFAULT_STATE };

  get isGameOver() {
    return ["victory", "defeat"].includes(this.state.status);
  }

  handleContinue() {
    this.started = false;
    this.state = { ...DEFAULT_STATE };
  }

  async begin() {
    try {
      await this.leave();
      this.api.room = await this.$client.create(SOLO_ROOM_NAME, { type: "freeplay" });
      applySoloGameServerResponses(this.api.room, this);
      this.started = true;
    } catch (err) {
      console.log("Error creating game room");
      console.error(err);
    }
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
