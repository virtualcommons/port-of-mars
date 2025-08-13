<template>
  <div class="h-100 d-flex flex-column justify-content-center">
    <SegmentedBar
      :min="0"
      :max="state.player.resources"
      v-model="pendingSystemHealthInvestment"
      :asInput="true"
      :disabled="shouldDisableInvest"
      :segment-class="{ 'animate-flashing vfd-green': shouldFlashInvestInput }"
      :helpText="helpText"
      size="md"
      class="mb-3"
    />
    <div class="text-center">
      <b-button
        @click="handleInvest"
        :disabled="shouldDisableInvest"
        variant="primary"
        size="lg"
        :class="{ 'animate-flashing vfd-red': shouldFlashInvestButton }"
        class="w-100"
      >
        <h4 class="mb-0">{{ buttonText }}</h4></b-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import SegmentedBar from "@port-of-mars/client/components/lite/SegmentedBar.vue";
import { LiteGameClientState } from "@port-of-mars/shared/lite";

@Component({
  components: {
    SegmentedBar,
  },
})
export default class Investment extends Vue {
  @Prop() state!: LiteGameClientState;
  @Prop({ default: 0 }) readonly value!: number;
  @Prop({ default: "" }) helpText!: string;
  @Prop({ default: "Invest in System Health" }) buttonText!: string;

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

  get shouldDisableInvest() {
    const cantInvest = !this.state.canInvest;
    if (this.state.players) {
      // if this is a multiplayer game:
      if (this.state.type === "prolificInteractive") {
        return cantInvest || this.state.player.hasInvested;
      }
      // not sure why this doesn't also consider canInvest, might not be needed
      return this.state.player.hasInvested;
    } else {
      // if this is a solo game:
      return cantInvest;
    }
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
