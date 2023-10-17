<template>
  <div v-if="loaded" class="d-flex flex-column justify-content-around p-3">
    <b-alert show variant="warning" class="px-2 py-1 dim-unless-hover">
      <h5 class="d-inline mr-1">+1</h5>
      additional event(s) will occur
      <strong>{{ twoCardThresholdInfo }}</strong>
      system health
    </b-alert>
    <b-alert show variant="danger" class="px-2 py-1 m-0 dim-unless-hover">
      <h5 class="d-inline mr-1">+2</h5>
      additional events will occur
      <strong>{{ threeCardThresholdInfo }}</strong>
      system health
    </b-alert>
  </div>
</template>

<script lang="ts">
import { SoloGameClientState } from "@port-of-mars/shared/sologame";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Thresholds extends Vue {
  @Prop() state!: SoloGameClientState;

  get twoCardThresholdInfo(): string {
    if (this.state.treatmentParams.thresholdInformation === "known") {
      return `at or below ${this.state.twoCardThreshold}`;
    } else {
      const range = this.state.twoCardThresholdRange!;
      return `between ${range.min}-${range.max}`;
    }
  }

  get threeCardThresholdInfo(): string {
    if (this.state.treatmentParams.thresholdInformation === "known") {
      return `at or below ${this.state.threeCardThreshold}`;
    } else {
      const range = this.state.threeCardThresholdRange!;
      return `between ${range.min}-${range.max}`;
    }
  }

  get loaded() {
    if (this.state.treatmentParams.thresholdInformation === "range") {
      return !!this.state.twoCardThresholdRange;
    }
    return true;
  }
}
</script>

<style lang="scss" scoped>
.dim-unless-hover {
  opacity: 0.6;
  transition: opacity 0.2s;
  &:hover {
    opacity: 1;
  }
}
</style>
