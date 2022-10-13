<template>
  <div class="countdown">
    <div class="countdown-block">
      <div class="countdown-digit">{{ format(hours) }}</div>
      <div class="countdown-unit">Hrs</div>
    </div>
    <div class="countdown-block">
      <div class="countdown-digit">{{ format(minutes) }}</div>
      <div class="countdown-unit">Min</div>
    </div>
    <div class="countdown-block">
      <div class="countdown-digit">{{ format(seconds) }}</div>
      <div class="countdown-unit">Sec</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class Countdown extends Vue {
  @Prop({})
  nextLaunch: number;

  now: number = Math.trunc(Date.now() / 1000);

  get secondsUntilLaunch() {
    return Math.trunc(this.nextLaunch / 1000) - this.now;
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

  mounted() {
    window.setInterval(() => {
      this.now = Math.trunc(Date.now() / 1000);
    }, 1000);
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
  text-align: center;
  padding: 0px 15px;
  position: relative;
  &:first-child {
    padding-left: 0;
    .countdown-digit {
      &:before {
        display: none;
      }
    }
  }
  &:last-child {
    padding-right: 0;
  }
}

.countdown-digit {
  font-size: 500%;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 5px;
  &:before{
    content: ":";
    position: absolute;
    left: -10px;
  }
}

.countdown-unit {
  text-transform: uppercase;
  margin-bottom: 5px;
}
</style>