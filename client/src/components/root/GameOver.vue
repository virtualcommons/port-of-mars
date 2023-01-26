<template>
  <b-container fluid class="h-100 m-0" style="background-color: var(--dark-shade-75)">
    <b-row align-v="center" align-h="center" class="h-100 w-100">
      <b-col cols="4" class="text-center">
        <h1>Port of Mars</h1>
        <div v-if="isVictory">
          <h2 class='my-2'>Victory!</h2>
          <h3 class='text-left'>
            You've successfully navigated the challenges of Mars and established 
            an extraterrestrial society. Thanks to your efforts,
            future generations can flourish on Mars.
          </h3>
        </div>
        <div v-else>
          <h2>Game Over</h2>
          <h3 class='mt-2 text-left'>Unfortunately, your team was not able to withstand the perils of Mars.</h3>
        </div>
        <b-list-group dark>
          <b-list-group-item variant="primary" class="d-flex justify-content-between align-items-center" v-for="(player, index) in players" :key="player.role + index">
            {{ roleLabel(player.role) }} 
            <b-badge :variant="index === 0 ? 'success' : 'primary'">{{ player.victoryPoints }}</b-badge>
          </b-list-group-item>
        </b-list-group>
        <h4 class="mt-5">Thank you for participating!</h4>
        <b-button block class="w-50 mx-auto" squared variant="light" :to="lobby">
          Return to lobby
        </b-button>
      </b-col>
      <b-col cols="8" class="h-75">
        <h3>Final Mars Log</h3>
        <div
          class="p-4"
          style="overflow-y: auto; overflow-x: hidden; height: 90%; background-color: var(--dark-shade)"
        >
          <MarsLog :logs="logs" :orderByMostRecent="true"></MarsLog>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { LOBBY_PAGE } from "@port-of-mars/shared/routes";
import { Phase, Role } from "@port-of-mars/shared/types";
import MarsLog from "@port-of-mars/client/components/game/MarsLog.vue";
import _ from "lodash";

@Component({
  components: {
    MarsLog
  }
})
export default class Victory extends Vue {

  lobby = { name: LOBBY_PAGE };

  get players() {
    return _.orderBy(this.$tstore.state.players, ['victoryPoints'], ['desc']);
  }

  get playerRole() {
    return this.$tstore.state.role;
  }

  get logs() {
    return this.$tstore.getters.logs;
  }

  get phase() {
    return this.$tstore.state.phase;
  }

  get isVictory() {
    return this.phase === Phase.victory;
  }

  roleLabel(role: Role) {
    return role === this.playerRole ? `${role} (Your Role)` : role;
  }
  
}
</script>