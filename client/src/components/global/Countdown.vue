<template>
  <div class="countdown">
    <div class="countdown-block">
      <div class="countdown-digit" :style="`font-size: ${size}rem`">{{ format(days) }}</div>
      <div class="countdown-unit">Days</div>
    </div>
    <div class="countdown-block">
      <div class="countdown-digit" :style="`font-size: ${size}rem`">{{ format(hours) }}</div>
      <div class="countdown-unit">Hrs</div>
    </div>
    <div class="countdown-block">
      <div class="countdown-digit" :style="`font-size: ${size}rem`">{{ format(minutes) }}</div>
      <div class="countdown-unit">Min</div>
    </div>
    <div class="countdown-block">
      <div class="countdown-digit" :style="`font-size: ${size}rem`">{{ format(seconds) }}</div>
      <div class="countdown-unit">Sec</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Countdown extends Vue {
  @Prop({ default: 0 })
  nextLaunch!: number;

  @Prop({ default: 3 })
  size!: number;

  secondInterval = 0;
  now: number = Math.trunc(Date.now() / 1000);

  get secondsUntilLaunch() {
    const seconds = Math.trunc(this.nextLaunch / 1000) - this.now;
    if (seconds <= 0) {
      this.$emit("launchTime");
      return 0;
    }
    return seconds;
  }

  get seconds() {
    return this.secondsUntilLaunch % 60;
  }

  get minutes() {
    return Math.trunc(this.secondsUntilLaunch / 60) % 60;
  }

  get hours() {
    return Math.trunc(this.secondsUntilLaunch / 60 / 60) % 24;
  }

  get days() {
    return Math.trunc(this.secondsUntilLaunch / 60 / 60 / 24);
  }

  mounted() {
    this.secondInterval = window.setInterval(() => {
      this.now = Math.trunc(Date.now() / 1000);
    }, 1000);
  }

  beforeDestroy() {
    clearInterval(this.secondInterval);
  }

  format(value: number) {
    if (value < 10) {
      return "0" + value.toString();
    } else {
      return value.toString();
    }
  }
}
</script>

<style lang="scss" scoped>
.countdown {
  display: flex;
  justify-content: center;
}

.countdown-block {
  background-color: rgba(255, 255, 255, 0.05);
  text-align: center;
  margin: 0.5rem;
  padding: 0.75rem;
  padding-bottom: 0.5rem;
  border-radius: 0.25rem;
  position: relative;
  &:first-child {
    .countdown-digit {
      &:before {
        display: none;
      }
    }
  }
}

.countdown-digit {
  font-weight: bold;
  line-height: 1;
}

.countdown-unit {
  text-transform: uppercase;
}
</style>
