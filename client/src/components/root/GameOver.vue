<template>
  <b-container class="h-100 mx-auto" style="background-color: var(--dark-shade-75)">
    <b-row align-v="center" align-h="center" class="h-100 w-100">
      <b-col cols="6" class="text-center">
        <div v-if="isVictory">
          <h1>Victory!</h1>
          <p class="mt-2 text-left">
            You've successfully navigated the challenges of Mars and established an extraterrestrial
            society. Thanks to your efforts, future generations can flourish on Mars.
          </p>
        </div>
        <div v-else>
          <h1>Game Over</h1>
          <p class="mt-2 text-left">
            Unfortunately, your team was not able to withstand the perils of Mars.
          </p>
        </div>
        <b-list-group dark>
          <b-list-group-item
            variant="primary"
            class="d-flex justify-content-between align-items-center"
            v-for="(player, index) in players"
            :key="player.role + index"
          >
            {{ roleLabel(player.role) }}
            <b-badge :variant="index === 0 ? 'success' : 'primary'">{{
              player.victoryPoints
            }}</b-badge>
          </b-list-group-item>
        </b-list-group>
        <h4 class="mt-5">Thank you for participating!</h4>
        <b-button block class="w-100" variant="success" size="lg" :to="freePlayLobby">
          <b-icon-chevron-left shift-v="-2" class="float-left"></b-icon-chevron-left>
          <h4 class="mb-0">Return to Lobby</h4>
        </b-button>
        <SocialShare
          class="text-left mt-3"
          :isVictory="isVictory"
          :victoryPoints="victoryPoints"
        ></SocialShare>
      </b-col>
      <b-col cols="6" class="h-75">
        <h4>Final Mars Log</h4>
        <div
          class="p-2 content-container"
          style="
            overflow-y: auto;
            overflow-x: hidden;
            height: 90%;
            background-color: var(--dark-shade);
          "
        >
          <MarsLog :logs="logs" :orderByMostRecent="true"></MarsLog>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { FREE_PLAY_LOBBY_PAGE } from "@port-of-mars/shared/routes";
import { Phase, Role } from "@port-of-mars/shared/types";
import MarsLog from "@port-of-mars/client/components/game/MarsLog.vue";
import SocialShare from "@port-of-mars/client/components/global/SocialShare.vue";
import _ from "lodash";

@Component({
  components: {
    MarsLog,
    SocialShare,
  },
})
export default class Victory extends Vue {
  freePlayLobby = { name: FREE_PLAY_LOBBY_PAGE };

  get players() {
    return _.orderBy(this.$tstore.state.players, ["victoryPoints"], ["desc"]);
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

  get victoryPoints() {
    return this.playerRole ? this.$tstore.state.players[this.playerRole].victoryPoints : 0;
  }

  roleLabel(role: Role) {
    return role === this.playerRole ? `${role} (Your Role)` : role;
  }
}
</script>
