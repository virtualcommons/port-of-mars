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
  timer = null;

  totalTime: number = 300;

  updated() {
    this.timer = setInterval(() => this.countdown(), 1000);
  }

  get minutes() {
    const minutes = Math.floor(this.totalTime / 60);
    return this.padTime(minutes);
  }

  get seconds() {
    const seconds = this.totalTime - (this.minutes * 60);
    return this.padTime(seconds);
  }

  padTime = time => (time < 10 ? '0' : '');

  get countdown() {
    const time = this.totalTime - 1;
    return time;
  }
  // // non-null operator (!) = compiler prop will have non-null value
  // @Prop(String) time!: string;
  //
  // private clock!: NodeJS.Timeout;
  //
  // mounted() {
  //   this.clock = setInterval(this.updateTime, 1000);
  // }
  //
  // // methods
  // updateTime() {
  //   // create Date object (current date and time on user's computer)
  //   const currentTime = new Date();
  //
  //   // extract hours, minutes, seconds components of current time from Date object
  //   const currentHours = currentTime.getHours();
  //   const currentMinutes = currentTime.getMinutes();
  //   const currentSeconds = currentTime.getSeconds();
  //
  //   // pad minutes and seconds with leading zeroes
  //   this.time = `${this.zeroPadding(currentMinutes, 1)}:${this.zeroPadding(currentSeconds, 2)}`;
  // }
  //
  // // eslint-disable-next-line class-methods-use-this
  // zeroPadding(timeComponent: number, num: number) {
  //   let zero = '';
  //   for (let i = 0; i < num; i += 1) {
  //     zero += '0';
  //   }
  //   return (zero + timeComponent).slice(-num);
  // }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Space+Mono:400,700&display=swap');
.timer {
  color: #F5F5F5;
}
.clock-container {
  color: #f5f5f5;
  font-size: 1rem;
}
</style>
