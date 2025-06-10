<!-- vacuum fluorescent display style numbers -->
<template>
  <div class="d-flex align-items-center position-relative">
    <div class="vfd-text-underlay" :style="textStyle">
      {{ underlay }}
    </div>
    <div
      class="vfd-text-glow d-flex justify-content-end"
      :class="`vfd-${variant}`"
      :style="textStyle"
    >
      {{ numberDisplay }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class VFDNumberDisplay extends Vue {
  @Prop({ default: 0 }) value!: number | string;
  @Prop() digits?: number;
  @Prop({ default: false }) padZeros!: boolean;
  @Prop({ default: 3 }) size!: 1 | 2 | 3; // in rem
  @Prop({ default: "green" }) variant!: "green" | "blue" | "red" | "yellow";

  get underlay(): string {
    if (this.digits) {
      return "8".repeat(this.digits);
    } else {
      return "8".repeat(this.numberDisplay.length);
    }
  }

  get numberDisplay(): string {
    // ! is a space in the font
    return this.value.toString().padStart(this.digits || 0, this.padZeros ? "0" : "!");
  }

  get textStyle(): string {
    return `font-size: ${this.size}rem;`;
  }
}
</script>

<style lang="scss" scoped></style>
