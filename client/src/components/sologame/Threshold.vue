<template>
  <div v-if="loaded" class="d-flex flex-column h-75 justify-content-around p-3">
    <p>
      <strong>Two</strong> event cards will be drawn when system health is
      <strong>{{ twoCardThreshold }}</strong>
    </p>
    <p>
      <strong>Three</strong> event cards will be drawn when system health is
      <strong>{{ threeCardThreshold }}</strong>
    </p>
  </div>
</template>

<script lang="ts">
import { SoloGameClientState } from "@port-of-mars/shared/sologame";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Thresholds extends Vue {
  @Prop() state!: SoloGameClientState;

  get twoCardThreshold(): string {
    if (this.state.treatmentParams.thresholdInformation === "known") {
      return `${this.state.twoCardThreshold} or lower`;
    } else {
      const range = this.state.twoCardThresholdRange!;
      return `between ${range.min} and ${range.max}`;
    }
  }

  get threeCardThreshold(): string {
    if (this.state.treatmentParams.thresholdInformation === "known") {
      return `${this.state.threeCardThreshold} or lower`;
    } else {
      const range = this.state.threeCardThresholdRange!;
      return `between ${range.min} and ${range.max}`;
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

<style lang="scss"></style>
