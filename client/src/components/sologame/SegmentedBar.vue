<template>
  <div class="vfd-container p-3">
    <div v-if="label">
      <h4 class="mb-0">{{ label }}</h4>
    </div>
    <div class="d-flex align-items-center flex-row">
      <button
        v-if="asInput"
        @click="decrement"
        class="vfd-button mr-3"
        style="height: 3rem; width: 3rem"
      >
        <b-icon icon="dash-lg" scale="1.5" />
      </button>
      <div
        v-if="asInput"
        class="d-flex flex-grow-1 user-select-none"
        style="cursor: ew-resize"
        @mousemove="checkAndSetValue($event)"
        @mouseup="setDragging(false)"
        @mouseleave="setDragging(false)"
        ref="bar"
      >
        <div
          v-for="index in max"
          :key="index"
          :class="getSegmentClass(index)"
          @click="localValue = index"
          @mousedown="setDragging(true)"
        ></div>
      </div>
      <div v-else class="d-flex flex-grow-1 user-select-none">
        <div v-for="index in max" :key="index" :class="getSegmentClass(index)"></div>
      </div>
      <button
        v-if="asInput"
        @click="increment"
        class="vfd-button ml-3"
        style="height: 3rem; width: 3rem"
      >
        <b-icon icon="plus-lg" scale="1.5" />
      </button>
      <VFDNumberDisplay
        :value="customTextDisplay || value"
        :digits="2"
        class="ml-3"
        :size="numberSize"
        :variant="variant"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import VFDNumberDisplay from "@port-of-mars/client/components/sologame/VFDNumberDisplay.vue";

@Component({
  components: {
    VFDNumberDisplay,
  },
})
export default class SegmentedBar extends Vue {
  @Prop({ default: 0 }) min!: number;
  @Prop() max!: number;
  @Prop({ default: false }) asInput!: boolean;
  @Prop({ default: false }) disabled!: boolean; // keep input mode but temporarily disable
  @Prop({ default: 0 }) readonly value!: number;
  @Prop({ default: 0 }) delta!: number;
  @Prop({ default: "" }) segmentClass!: string;
  @Prop({ default: "" }) label!: string;
  @Prop({ default: "lg" }) size!: "sm" | "md" | "lg";
  @Prop({ default: "green" }) variant!: "green" | "blue" | "red" | "yellow";
  @Prop({ default: "" }) customTextDisplay!: string;

  dragging = false;

  get localValue(): number {
    return this.value;
  }

  set localValue(value: number) {
    if (value >= this.min && value <= this.max) {
      this.$emit("input", value);
    }
  }

  sizeMap = {
    sm: 1,
    md: 2,
    lg: 3,
  };

  get numberSize(): number {
    return this.sizeMap[this.size] || 3;
  }

  getSegmentClass(index: number): string[] {
    return [
      "segment",
      `vfd-${this.variant}`,
      this.size,
      this.segmentClass,
      this.getGlowClass(index),
    ];
  }

  getGlowClass(index: number): string {
    const dimStart = this.value + this.delta;
    const minDim = Math.min(this.value, dimStart);
    const maxDim = Math.max(this.value, dimStart);
    if (index <= minDim) {
      return "vfd-bg-glow";
    } else if (index <= maxDim) {
      return "vfd-bg-glow-dim";
    } else {
      return "vfd-bg-underlay";
    }
  }

  setDragging(value: boolean) {
    this.dragging = value;
  }

  checkAndSetValue(event: any) {
    if (event.buttons !== 1) {
      return;
    }
    const boundingRect = event.currentTarget.getBoundingClientRect();
    const segmentWidth = boundingRect.width / this.max;
    const relativeX = event.clientX - boundingRect.left;
    this.localValue = Math.ceil(relativeX / segmentWidth);
  }

  decrement() {
    this.localValue = this.localValue - 1;
  }

  increment() {
    this.localValue = this.localValue + 1;
  }

  created() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (!this.asInput || this.disabled) {
      return;
    }
    switch (event.key) {
      case "ArrowLeft":
        this.decrement();
        break;
      case "ArrowRight":
        this.increment();
        break;
    }
  }

  beforeDestroy() {
    if (this.asInput) {
      (this.$refs.bar as HTMLElement).removeEventListener("wheel", this.handleWheel);
    }
  }

  handleWheel(event: WheelEvent) {
    if (event.deltaY < 0) {
      this.increment();
    } else {
      this.decrement();
    }
  }
}
</script>

<style lang="scss" scoped>
.segment {
  flex: 1;
  border-radius: 1px;
  &.sm {
    height: 1rem;
    margin: 0.1rem;
  }
  &.md {
    height: 2rem;
    margin: 0.15rem;
  }

  &.lg {
    height: 3rem;
    margin: 0.2rem;
  }
}
</style>
