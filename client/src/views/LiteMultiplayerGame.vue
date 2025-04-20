<template>
  <div class="backdrop d-flex justify-content-center align-items-center">
    <b-container class="h-100 dashboard-container content-container p-0" no-gutters>
      <!-- FIXME: there needs to be a self player -->
      <GameOver
        v-if="isGameOver"
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
import { Client, Room } from "colyseus.js";
import { cloneDeep } from "lodash";
import { MultiplayerGameRequestAPI } from "@port-of-mars/client/api/pomlite/multiplayer/request";
import {
  DEFAULT_STATE,
  applyMultiplayerGameServerResponses,
} from "@port-of-mars/client/api/pomlite/multiplayer/response";
import { MultiplayerLiteGameClientState } from "@port-of-mars/shared/lite";
import Dashboard from "@port-of-mars/client/components/lite/multiplayer/Dashboard.vue";
import GameOver from "@port-of-mars/client/components/lite/multiplayer/GameOver.vue";
import Splash from "@port-of-mars/client/components/lite/solo/Splash.vue";

@Component({
  name: "LiteMultiplayerGame",
  components: {
    Dashboard,
    Splash,
    GameOver,
  },
})
export default class LiteMultiplayerGame extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() private api: MultiplayerGameRequestAPI = new MultiplayerGameRequestAPI();
  hasApi = false;
  started = false;

  state: MultiplayerLiteGameClientState = cloneDeep(DEFAULT_STATE);

  get isGameOver() {
    return ["victory", "defeat"].includes(this.state.status);
  }

  handleContinue() {
    this.started = false;
    Object.assign(this.state, cloneDeep(DEFAULT_STATE));
  }

  async created() {
    // TODO: join the room, copy from Game.vue
    // but how do we get the roomId?
    this.api.room?.leave();
    let gameRoom: Room;
    const cachedRoomId = this.$ajax.roomId;
    if (!cachedRoomId) {
      // FIXME: the OG game will hit the db to find the correct
      // game if no cached id, though this _should_ always be there..
      console.error("Cached room ID not found");
      return;
    }
    try {
      gameRoom = await this.$client.joinById(cachedRoomId);
      applyMultiplayerGameServerResponses(gameRoom, this, this.$client);
      this.api.connect(gameRoom);
      this.hasApi = true;
      this.started = true;
    } catch (e) {
      if (e instanceof Error) {
        this.$tstore.commit("SET_DASHBOARD_MESSAGE", {
          kind: "danger",
          message: e.message,
        });
      }
      console.error("Failed to join game room", e);
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

.dashboard-container {
  max-width: 1200px;
  max-height: 700px;
}
</style>
