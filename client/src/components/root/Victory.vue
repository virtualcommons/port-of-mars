<template>
  <b-container fluid class="h-100 m-0" style="background-color: var(--dark-shade-75)">
    <b-row align-v="center" align-h="center" class="h-100 w-100">
      <b-col cols="4" class="text-center">
        <h1>Port of Mars</h1>
        <h2>Victory!</h2>
        <span v-for="winner in winners" :key="winner" class="my-3">
          <p>{{ winner }}</p>
        </span>
        <h3>
          Despite all doubts, you have successfully established an extraterrestrial society. Thanks
          to you, future generations can flourish on Mars.
        </h3>
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
import { Vue, Component, InjectReactive, Inject } from "vue-property-decorator";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import { MarsLogMessageData } from "@port-of-mars/shared/types";
import { DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
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

  get logs() {
    return _.sortBy(this.$store.getters.logs, ml => -ml.id);
  }

  get categoryColorMap() {
    return this.$store.getters.categoryColorMap;
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

  private logTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }

  get winners() {
    return this.$tstore.state.winners;
  }
}
</script>

<style lang="scss" scoped>
@import "~animate.css/source/attention_seekers/pulse.css";
@import "@port-of-mars/client/stylesheets/root/Victory.scss";
</style>
