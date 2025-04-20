<template>
  <div class="h-100 d-flex flex-column justify-content-center">
    <SegmentedBar
      :min="0"
      :max="state.player.resources"
      v-model="pendingSystemHealthInvestment"
      :asInput="true"
      :disabled="!state.canInvest"
      :segment-class="{ 'animate-flashing vfd-green': shouldFlashInvestInput }"
      class="mb-3"
    />
    <div class="text-center">
      <b-button
        @click="handleInvest"
        :disabled="!state.canInvest"
        variant="primary"
        size="lg"
        :class="{ 'animate-flashing vfd-red': shouldFlashInvestButton }"
      >
        <h4 class="mb-0">Invest in System Health</h4></b-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import SegmentedBar from "@port-of-mars/client/components/lite/SegmentedBar.vue";
import { BaseLiteGameClientState } from "@port-of-mars/shared/lite";

@Component({
  components: {
    SegmentedBar,
  },
})
export default class Investment extends Vue {
  @Prop() state!: BaseLiteGameClientState;
  @Prop({ default: 0 }) readonly value!: number;

  get pendingSystemHealthInvestment(): number {
    return this.value;
  }

  set pendingSystemHealthInvestment(value: number) {
    this.$emit("input", value);
  }

  get shouldFlashInvestButton() {
    return (
      this.pendingSystemHealthInvestment > 0 &&
      this.state.round === 1 &&
      !this.state.isRoundTransitioning
    );
  }

  get shouldFlashInvestInput() {
    return (
      this.pendingSystemHealthInvestment === 0 &&
      this.state.round === 1 &&
      !this.state.isRoundTransitioning
    );
  }

  get pendingPointsValue() {
    return this.state.player.resources - this.pendingSystemHealthInvestment;
  }

  created() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (!this.state.canInvest) {
      return;
    }
    if (event.key === "Enter") {
      this.handleInvest();
    }
  }

  handleInvest() {
    this.$emit("invest", this.pendingSystemHealthInvestment);
    // FIXME: only reset to 0 if invest was successful
    this.pendingSystemHealthInvestment = 0;
  }
}
</script>

<style lang="scss" scoped></style>
