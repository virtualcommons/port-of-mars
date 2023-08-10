<template>
  <div>
    <div class="input-container">
      <b-button v-if="asInput" @click="decrement" variant="link">
        <h1>-</h1>
      </b-button>
      <div
        v-if="asInput"
        class="bar"
        @mousemove="checkAndSetValue($event)"
        @mouseup="setDragging(false)"
        @mouseleave="setDragging(false)"
      >
        <div
          v-for="index in max"
          :key="index"
          :class="['segment', segmentClass, { 'bg-success': index <= value }]"
          @click="localValue = index"
          @mousedown="setDragging(true)"
        ></div>
      </div>
      <div v-else class="bar">
        <div
          v-for="index in max"
          :key="index"
          :class="['segment', segmentClass, { 'bg-success': index <= value }]"
        ></div>
      </div>
      <b-button v-if="asInput" @click="increment" variant="link">
        <h1>+</h1>
      </b-button>
      <h1>{{ value }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class SegmentedBar extends Vue {
  @Prop({ default: 0 }) min!: number;
  @Prop() max!: number;
  @Prop({ default: false }) asInput!: boolean;
  @Prop({ default: 0 }) readonly value!: number;
  @Prop({ default: "" }) segmentClass!: string;

  dragging = false;

  get localValue(): number {
    return this.value;
  }

  set localValue(value: number) {
    if (value >= this.min && value <= this.max) {
      this.$emit("input", value);
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
}
</script>

<style lang="scss" scoped>
.input-container {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.bar {
  display: flex;
  flex-grow: 1;
  user-select: none;
}

.segment {
  flex: 1;
  height: 30px;
  background: black;
  margin: 2px;
}

.segment.selected {
  background: lightgreen;
}
</style>
