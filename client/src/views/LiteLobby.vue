<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 backdrop">
    <div class="h-100 w-100 d-flex flex-column">
      <div
        class="d-flex flex-column justify-content-center align-items-center flex-grow-1 text-center"
      >
        <div class="content-container p-5">
          <p>Waiting for players to join...</p>
          <div v-if="clients" class="mt-4">
            <h4>{{ clients.length }} / {{ requiredPlayers }} Players</h4>
            <b-progress
              :value="clients.length"
              :max="requiredPlayers"
              animated
              class="mt-3"
              style="max-width: 400px; margin: auto"
            ></b-progress>
            <p class="mt-3">
              A game will launch automatically when {{ requiredPlayers }} players have joined.
            </p>
          </div>
          <div v-else class="mt-4">
            <b-spinner label="Loading..."></b-spinner>
            <p class="mt-2">Connecting to lobby...</p>
          </div>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { applyLiteLobbyResponses } from "@port-of-mars/client/api/lobby/response";
import { LiteLobbyRequestAPI } from "@port-of-mars/client/api/lobby/request";
import { LITE_LOBBY_NAME } from "@port-of-mars/shared/lobby";
import { settings } from "@port-of-mars/shared/settings";

@Component({})
export default class LiteLobby extends Vue {
  @Inject() readonly $client!: Client;
  api: LiteLobbyRequestAPI = new LiteLobbyRequestAPI(this.$ajax);

  get clients() {
    return this.$tstore.state.lobby?.clients || [];
  }

  get requiredPlayers() {
    return settings.LITE_MULTIPLAYER_PLAYERS_COUNT;
  }

  async created() {
    try {
      const room = await this.$client.joinOrCreate(LITE_LOBBY_NAME);
      applyLiteLobbyResponses(room, this);
      this.api.connect(room);
    } catch (e) {
      // TODO: redirect back to study page and show error message (with Messages)
    }
  }

  beforeDestroy() {
    this.api.leave();
    this.$tstore.commit("RESET_LOBBY_STATE");
  }
}
</script>

<style lang="scss" scoped></style>
