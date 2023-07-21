<template>
  <div>
    <div class="input-container">
      <!-- <h1 @click="setValue(value - 1)" style="margin-right: 20px; user-select: none">-</h1> -->
      <!-- <h1 @click="decrement" :style="{ cursor: isDecrementDisabled ? 'not-allowed' : 'pointer' }">
        -
      </h1> -->
      <h1 v-if="!disableInputs" @click="decrement">-</h1>
      <div
        class="bar"
        @mousemove="checkAndSetValue($event)"
        @mouseup="!disabled && (drag = false)"
        @mouseleave="!disabled && (drag = false)"
      >
        <div
          class="segment"
          v-for="(segment, index) in segments"
          :key="index"
          :class="{ 'bg-success': index < value }"
          @click="!disabled && setValue(index + 1)"
          @mousedown="!disabled && (drag = true)"
        ></div>
      </div>
      <!-- <h1 @click="setValue(value + 1)" style="margin-left: 20px; user-select: none">+</h1> -->
      <!-- <h1 @click="increment" :style="{ cursor: isIncrementDisabled ? 'not-allowed' : 'pointer' }">
        +
      </h1> -->
      <h1 v-if="!disabled" @click="increment">+</h1>
    </div>
    <h1>{{ value }}</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class SegmentedBar extends Vue {
  @Prop({ default: 0 }) min!: number;
  @Prop() max!: number;
  @Prop({ default: false }) asInput!: boolean;
  @Prop({ default: 0 }) value!: number;
  @Prop({ default: false }) disabled!: boolean;

  segments = Array(this.max).fill(0);
  drag = false;

  setValue(value: number) {
    if (value >= this.min && value <= this.max) {
      this.value = value;
      this.$emit("input", this.value);
    }
  }

  checkAndSetValue(event: any) {
    if (event.buttons !== 1) {
      return;
    }
    const boundingRect = event.currentTarget.getBoundingClientRect();
    const segmentWidth = boundingRect.width / this.segments.length;
    const relativeX = event.clientX - boundingRect.left;
    this.setValue(Math.ceil(relativeX / segmentWidth));
  }

  get isDecrementDisabled() {
    return this.value <= this.min;
  }

  get isIncrementDisabled() {
    return this.value >= this.max;
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
  transform: skew(-15deg);
  border: 2px solid darkslategrey;
}

.segment.selected {
  background: lightgreen;
}
</style>
