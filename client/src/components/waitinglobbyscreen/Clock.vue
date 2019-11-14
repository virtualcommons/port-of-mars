<template>
  <div class="clock-container">
    <p>{{ time }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';


@Component
export default class Clock extends Vue {
      // non-null operator (!) = compiler prop will have non-null value
      @Prop(String)
      time!:string;

      private clock!: NodeJS.Timeout;

      mounted() {
        this.clock = setInterval(this.updateTime, 1000);
      }

      // methods
      updateTime() {
        // create Date object (current date and time on user's computer)
        const currentTime = new Date();

        // extract hours, minutes, seconds components of current time from Date object
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const currentSeconds = currentTime.getSeconds();

        // pad minutes and seconds with leading zeroes
        this.time = `${this.zeroPadding(currentHours, 2)}:${this.zeroPadding(currentMinutes, 2)}:${this.zeroPadding(currentSeconds, 2)}`;
      }

      // eslint-disable-next-line class-methods-use-this
      zeroPadding(timeComponent:number, num:number) {
        let zero = '';
        for (let i = 0; i < num; i += 1) {
          zero += '0';
        }
        return (zero + timeComponent).slice(-num);
      }
}
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Space+Mono:400,700&display=swap');

  .clock-container {
    /*container position*/
    background: inherit;
    text-align: center;
    position: absolute;
    right: 75%;
    top: 8%;

    /*container styling*/
    font-family: var(--font-family-default);
    font-size: 65px;
    color: #ffddba;
    text-shadow: 0 0 20px rgb(230, 219, 0),  0 0 20px rgba(10, 175, 230, 0);
  }

</style>
