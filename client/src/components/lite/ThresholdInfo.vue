<template>
  <div v-if="loaded" class="d-flex flex-column justify-content-around p-3">
    <b-alert show variant="warning" class="px-2 py-1 dim-unless-hover">
      <b-badge variant="warning">+1</b-badge>
      additional event(s) will occur
      <strong>{{ twoEventsThresholdInfo }}</strong>
      system health
    </b-alert>
    <b-alert show variant="danger" class="px-2 py-1 m-0 dim-unless-hover">
      <b-badge variant="danger">+2</b-badge>
      additional events will occur
      <strong>{{ threeEventsThresholdInfo }}</strong>
      system health
    </b-alert>
  </div>
</template>

<script lang="ts">
import { BaseLiteGameClientState } from "@port-of-mars/shared/lite";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ThresholdInfo extends Vue {
  @Prop() state!: BaseLiteGameClientState;
  @Prop() thresholdInformation!: "known" | "range";

  get twoEventsThresholdInfo(): string {
    if (this.thresholdInformation === "known") {
      return `below ${this.state.twoEventsThreshold}`;
    } else {
      const range = this.state.twoEventsThresholdRange!;
      return `between ${range.min}-${range.max}`;
    }
  }

  get threeEventsThresholdInfo(): string {
    if (this.thresholdInformation === "known") {
      return `below ${this.state.threeEventsThreshold}`;
    } else {
      const range = this.state.threeEventsThresholdRange!;
      return `between ${range.min}-${range.max}`;
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

<style lang="scss" scoped>
.dim-unless-hover {
  opacity: 0.6;
  transition: opacity 0.2s;
  &:hover {
    opacity: 1;
  }
}
</style>
