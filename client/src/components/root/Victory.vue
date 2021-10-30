<template>
  <b-container fluid class="h-100 m-0" style="background-color: var(--dark-shade-75)">
    <b-row align-v="center" align-h="center" class="h-100 w-100">
      <b-col cols="4" class="text-center">
        <h1>Port of Mars</h1>
        <h2>Victory!</h2>
        <ol v-for="(player, index) in winners" :key="player" class="my-3">
          <li>{{ player }} <b-badge :variant="index === 0 ? 'success' : 'primary'">{{ points(player) }}</b-badge></li>
        </ol>
        <h3>
          Despite all doubts, you have successfully established an extraterrestrial society. Thanks
          to you, future generations can flourish on Mars.
        </h3>
        <h4 class="mt-5">Thank you for participating!</h4>
        <b-button block class="w-50 mx-auto" squared variant="light" :to="dashboard">
          Take the exit survey
        </b-button>
      </b-col>
      <b-col cols="8" class="h-75">
        <div
          class="p-5"
          style="overflow-y: auto; overflow-x: hidden; height: 90%; background-color: var(--dark-shade)"
        >
          <MarsLog orderByMostRecent="true"></MarsLog>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import { DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import { Role } from "@port-of-mars/shared/types";
import MarsLog from "@port-of-mars/client/components/game/MarsLog.vue";
import _ from "lodash";

@Component({
  components: {
    MarsLog
  }
})
export default class Victory extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  get dashboard() {
    return { name: DASHBOARD_PAGE };
  }

  get winners() {
    return this.$tstore.state.winners;
  }
  
  points(role: Role) {
    return this.$tstore.state.players[role].victoryPoints;
  }
}
</script>

<style lang="scss" scoped>
@import "~animate.css/source/attention_seekers/pulse.css";
@import "@port-of-mars/client/stylesheets/root/Victory.scss";
</style>
