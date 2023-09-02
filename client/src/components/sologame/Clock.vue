<template>
  <div class="d-flex py-2 px-3 vfd-container">
    <VFDNumberDisplay
      :textColor="'vfd-red'"
      :glowColor="'vfd-red-glow'"
      :digits="2"
      :value="minutesRemaining"
    />
    <p style="font-size: 3rem" class="vfd-text-glow">:</p>
    <VFDNumberDisplay :digits="2" :value="secondsRemaining" :padZeros="true" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import VFDNumberDisplay from "@/components/sologame/VFDNumberDisplay.vue";

@Component({
  components: {
    VFDNumberDisplay,
  },
})
export default class Clock extends Vue {
  @Prop({ default: 0 }) timeRemaining!: number;
  @Prop({ default: 3 }) size!: number; // in rem

  get secondsRemaining() {
    return this.timeRemaining % 60;
  }

  get minutesRemaining() {
    return Math.floor(this.timeRemaining / 60);
  }
}
</script>

<style lang="scss"></style>
