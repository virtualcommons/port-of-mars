<template>
  <div class="d-flex flex-column align-items-center vfd-container px-2">
    <div class="d-flex px-3">
      <VFDNumberDisplay
        :digits="2"
        :value="showBlank ? '!!' : minutesRemaining"
        variant="red"
        :size="size"
      />
      <p :style="`font-size: ${size}rem`" class="vfd-text-glow vfd-red">:</p>
      <VFDNumberDisplay
        :digits="2"
        :value="showBlank ? '!!' : secondsRemaining"
        :padZeros="true"
        variant="red"
        :size="size"
      />
    </div>
    <b-button
      v-if="showExtendButton"
      size="sm"
      variant="link"
      class="py-0 px-1"
      style="margin-top: -0.5rem"
      :disabled="timeExtensionUsed"
      @click="handleExtendClick"
      :id="'extend-timer-btn'"
    >
      <span v-if="timeExtensionUsed">Timer extended</span>
      <span v-else>Extend timer</span>
    </b-button>
    <span v-else class="m-2"></span>
    <b-popover target="extend-timer-btn" triggers="hover focus" placement="bottom">
      <small>
        Add 30 seconds to this round's timer so your team can discuss and plan. Usable once per
        round.
      </small>
    </b-popover>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import VFDNumberDisplay from "@port-of-mars/client/components/lite/VFDNumberDisplay.vue";

@Component({
  components: {
    VFDNumberDisplay,
  },
})
export default class Clock extends Vue {
  @Prop({ default: 0 }) timeRemaining!: number;
  @Prop({ default: 1.5 }) size!: number; // in rem
  @Prop({ default: false }) showBlank!: boolean;
  @Prop({ default: false }) timeExtensionUsed!: boolean;
  @Prop({ default: true }) showExtendButton!: boolean;

  get secondsRemaining() {
    return this.timeRemaining % 60;
  }

  get minutesRemaining() {
    return Math.floor(this.timeRemaining / 60);
  }

  handleExtendClick() {
    this.$emit("extend");
    // hide popover if it is open so it doesn't get stuck on disabled button
    (this as any).$root.$emit("bv::hide::popover", "extend-timer-btn");
  }
}
</script>

<style lang="scss"></style>
