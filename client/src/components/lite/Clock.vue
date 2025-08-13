<template>
  <div class="d-flex px-3 vfd-container">
    <VFDNumberDisplay :digits="2" :value="minutesRemaining" variant="red" :size="size" />
    <p :style="`font-size: ${size}rem`" class="vfd-text-glow vfd-red">:</p>
    <VFDNumberDisplay
      :digits="2"
      :value="secondsRemaining"
      :padZeros="true"
      variant="red"
      :size="size"
    />
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
