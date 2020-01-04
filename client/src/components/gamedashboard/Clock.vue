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

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/Clock.scss';
</style>
