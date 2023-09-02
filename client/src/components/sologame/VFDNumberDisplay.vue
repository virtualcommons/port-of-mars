<!-- Vacuum flourescent display styled numbers -->
<template>
  <div class="text-container">
    <div class="vfd-text-underlay" :style="textStyle">{{ underlay }}</div>
    <div class="vfd-text-glow d-flex justify-content-end" :style="textStyle">
      {{ numberDisplay }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class VFDNumberDisplay extends Vue {
  @Prop({ default: 0 }) value!: number;
  @Prop() digits?: number;
  @Prop({ default: 3 }) size!: number; // in rem
  @Prop({ default: false }) padZeros!: boolean;
  @Prop({ default: "vfd-green" }) textColor!: string;
  @Prop({ default: "vfd-green-glow" }) glowColor!: string;

  get underlay(): string {
    if (this.digits) {
      return "8".repeat(this.digits);
    } else {
      return "8".repeat(this.numberDisplay.length);
    }
  }

  get numberDisplay(): string {
    if (!this.padZeros && this.value === 0) {
      return "!".repeat(this.digits || 0);
    }
    return this.value.toString().padStart(this.digits || 0, this.padZeros ? "0" : "!"); // ! is a space
  }

  get textStyle(): string {
    return `font-size: ${this.size}rem;`;
  }
}
</script>

<style lang="scss">
.text-container {
  display: flex;
  align-items: center;
  position: relative;
}
</style>
