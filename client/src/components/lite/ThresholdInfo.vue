<template>
  <div v-if="loaded" class="d-flex flex-column justify-content-around">
    <p class="mb-2 text-muted">
      <b-badge variant="warning">+1</b-badge>
      extra event will occur
      <strong>{{ twoEventsThresholdInfo }}</strong>
      system health
    </p>
    <p class="m-0 text-muted">
      <b-badge variant="danger">+2</b-badge>
      extra events will occur
      <strong>{{ threeEventsThresholdInfo }}</strong>
      system health
    </p>
  </div>
</template>

<script lang="ts">
import { LiteGameClientState } from "@port-of-mars/shared/lite";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ThresholdInfo extends Vue {
  @Prop() state!: LiteGameClientState;
  @Prop() thresholdInformation!: "known" | "range";

  normalize(value: number): number {
    if (value === 0) {
      return 0;
    }
    // extra safety
    if (this.state.numPlayers > 0) {
      return Math.floor((value - 1) / this.state.numPlayers) + 1;
    }
    return value;
  }

  get twoEventsThresholdInfo(): string {
    if (this.thresholdInformation === "known") {
      if (typeof this.state.twoEventsThreshold === "number") {
        return `below ${this.normalize(this.state.twoEventsThreshold)}`;
      }
      return "threshold not available";
    } else {
      const range = this.state.twoEventsThresholdRange;
      if (range && typeof range.min === "number" && typeof range.max === "number") {
        const normalizedMin = this.normalize(range.min);
        const normalizedMax = this.normalize(range.max);
        return `between ${normalizedMin}-${normalizedMax}`;
      }
      return "range not available";
    }
  }

  get threeEventsThresholdInfo(): string {
    if (this.thresholdInformation === "known") {
      if (typeof this.state.threeEventsThreshold === "number") {
        return `below ${this.normalize(this.state.threeEventsThreshold)}`;
      }
      return "threshold not available";
    } else {
      const range = this.state.threeEventsThresholdRange;
      if (range && typeof range.min === "number" && typeof range.max === "number") {
        const normalizedMin = this.normalize(range.min);
        const normalizedMax = this.normalize(range.max);
        return `between ${normalizedMin}-${normalizedMax}`;
      }
      return "range not available";
    }
  }

  get loaded() {
    if (this.thresholdInformation === "range") {
      return !!this.state.twoEventsThresholdRange;
    }
    return true;
  }
}
</script>

<style lang="scss" scoped></style>
