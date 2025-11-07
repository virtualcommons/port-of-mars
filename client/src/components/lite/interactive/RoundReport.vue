<template>
  <div class="d-flex flex-column justify-content-start align-items-stretch h-100">
    <div class="d-flex justify-content-around align-items-end w-100 mb-3">
      <div class="text-center">
        <h4 class="mb-0">{{ lastRoundReport.previousSystemHealth }}</h4>
        <h6 class="mb-0 text-muted">previous</h6>
      </div>
      <div class="mx-3" style="font-size: 1.5rem">&rarr;</div>
      <div class="text-center">
        <h4 class="mb-0">{{ lastRoundReport.currentSystemHealth }}</h4>
        <h6 class="mb-0 text-muted">current</h6>
      </div>
    </div>

    <div class="d-flex flex-column w-100">
      <div class="d-flex justify-content-between align-items-center py-0 px-2">
        <span>You invested</span>
        <h6 class="mb-0 text-success">+{{ selfContribution }}</h6>
      </div>
      <div class="d-flex justify-content-between align-items-center py-0 px-2">
        <span>Others invested</span>
        <h6 class="mb-0 text-success">+{{ othersContribution }}</h6>
      </div>
      <div class="d-flex justify-content-between align-items-center py-0 px-2">
        <span>Average contribution</span>
        <h6 class="mb-0 text-muted">{{ averageContribution }}</h6>
      </div>
      <div
        class="d-flex justify-content-between align-items-center py-0 px-2 bg-success rounded text-black"
      >
        <span>Total contributions</span>
        <h6 class="mb-0">+{{ totalContributions }}</h6>
      </div>
      <div class="d-flex justify-content-between align-items-center py-0 px-2">
        <span>Events</span>
        <h6 class="mb-0 text-danger">{{ eventsLoss }}</h6>
      </div>
      <div class="d-flex justify-content-between align-items-center py-0 px-2">
        <span>Wear and tear</span>
        <h6 class="mb-0 text-danger">{{ wearAndTearLoss }}</h6>
      </div>
      <div
        class="d-flex justify-content-between align-items-center py-0 px-2 bg-danger rounded text-black"
      >
        <span>Total losses</span>
        <h6 class="mb-0">{{ totalLosses }}</h6>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { LiteGamePlayerClientState, SystemHealthReportData } from "@port-of-mars/shared/lite";

@Component({})
export default class RoundReport extends Vue {
  @Prop() players!: Record<string, LiteGamePlayerClientState>;
  @Prop() lastRoundReport!: SystemHealthReportData;
  @Prop() selfPlayer!: LiteGamePlayerClientState;

  get totalContributions() {
    return Object.values(this.players).reduce((a, b) => a + b.systemHealthContribution, 0);
  }

  get averageContribution() {
    return Math.round((this.totalContributions / Object.keys(this.players).length) * 100) / 100;
  }

  get selfContribution() {
    return this.selfPlayer.systemHealthContribution;
  }

  get othersContribution() {
    return this.totalContributions - this.selfContribution;
  }

  get eventsLoss() {
    return this.lastRoundReport.eventsDelta;
  }

  get wearAndTearLoss() {
    return -this.lastRoundReport.standardDecay;
  }

  get totalLosses() {
    return this.eventsLoss + this.wearAndTearLoss;
  }
}
</script>
