<template>
  <b-container fluid class="h-100 m-0" style="background-color: var(--dark-shade-75)">
    <b-row align-v="center" align-h="center" class="h-100 w-100">
      <b-col cols="4" class="text-center">
        <h1>Port of Mars</h1>
        <h2>Game Over</h2>
        <h3>Unfortunately, your team was not able to withstand the perils of Mars.</h3>
        <h3 class="mt-5">Thank you for participating!</h3>
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
import { Component, Inject, Vue } from "vue-property-decorator";
import MarsLog from "@port-of-mars/client/components/game/MarsLog.vue";
import { DASHBOARD_PAGE } from "@port-of-mars/shared/routes";
import _ from "lodash";

@Component({
  components: {
    MarsLog
  }
})
export default class Defeat extends Vue {

  get dashboard() {
    return { name: DASHBOARD_PAGE };
  }

}
</script>
