<template>
  <div class="timer">
    <span id="minutes">{{ minutes }}</span>
    <span id="middle">:</span>
    <span id="seconds">{{ seconds }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Clock extends Vue {
  // timer = null;
  //
  // totalTime: number = 300;
  //
  // updated() {
  //   this.timer = setInterval(() => this.countdown(), 1000);
  // }
  //
  // get minutes() {
  //   const minutes = Math.floor(this.totalTime / 60);
  //   return this.padTime(minutes);
  // }
  //
  // get seconds() {
  //   const seconds = this.totalTime - (this.minutes * 60);
  //   return this.padTime(seconds);
  // }
  //
  // padTime = dateCreated => (dateCreated < 10 ? '0' : '');
  //
  // get countdown() {
  //   const dateCreated = this.totalTime - 1;
  //   return dateCreated;
  // }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Space+Mono:400,700&display=swap');
.timer {
  color: var(--space-white);
}
.clock-container {
  color: var(--space-white);
  font-size: var(--font-med);
}
</style>
