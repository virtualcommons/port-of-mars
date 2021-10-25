<template>
  <b-container fluid class="h-100 m-0" style="background-color: var(--dark-shade-75)">
    <b-row align-v="center" align-h="center" class="h-100 w-100">
      <b-col cols="4" class="text-center">
        <h1>Port of Mars</h1>
        <h2>Game Over</h2>
        <h3>Your team has perished.</h3>
        <h3 class="mt-5">Thank you for playing.</h3>
        <b-button block class="w-50 mx-auto" squared variant="light" :to="dashboard"
          >Take the exit survey</b-button
        >
      </b-col>
      <b-col cols="8" class="h-75">
        <div
          class="p-5"
          style="overflow-y: auto; overflow-x: hidden; height: 90%; background-color: var(--dark-shade)"
        >
          <MarsLog></MarsLog>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import { MarsLogMessageData } from "@port-of-mars/shared/types";
import MarsLog from "@port-of-mars/client/components/game/MarsLog.vue";
import { DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import _ from "lodash";

@Component({
  components: {
    MarsLog
  }
})
export default class Defeat extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  get dashboard() {
    return { name: DASHBOARD_PAGE };
  }

  get logs() {
    return _.sortBy(this.$store.getters.logs, ml => -ml.id);
  }

  get categoryColorMap() {
    return this.$store.getters.categoryColorMap;
  }

  private logTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }

  private delineateRound(index: number, logs: MarsLogMessageData[]): boolean {
    let currentIndex: number = index;
    let nextIndex: number = index + 1;

    // console.log('currentIndex ', currentIndex);

    if (!logs[nextIndex]) {
      // console.log('undefined');
      return false;
    } else return logs[currentIndex].round !== logs[nextIndex].round;
  }
}
</script>
