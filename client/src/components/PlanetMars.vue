<template>
  <div class="mars-container">
    <div class="mars">
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class PlanetMars extends Vue {
}
</script>

<style scoped>
  * {
    box-sizing: border-box;
  }

  .mars-container {
    background: inherit;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle, #3d0000, #100f11 20%, transparent);
  }

  .mars {
    position: relative;
    top: 25%;

    /* mars dimensions + spacing */
    width: 300px;
    height: 300px;
    margin: 3em auto;

    /* mars rotating animation */
    transition: transform 200ms linear;
    animation: rotate 50s linear infinite;

    color: black;
    border-radius: 50%;
    /*mix-blend-mode: overlay;*/
    background: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/85486/mars-bg-min.jpg") 0 0 repeat;

    /* position in 3d */
    transform-style: preserve-3d;
  }

  .mars:after {
    /* show as overlay */
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    /* mars styling: shape + shadow */
    border-radius: 50%;
    box-shadow: -80px 15px 80px 10px rgba(0, 0, 0, 0.9) inset;
  }

  .mars:before {
    /* show as overlay */
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    content: '';

    /* mars styling: shape + shadow*/
    opacity: 0.2;
    border-radius: 50%;
    background: radial-gradient(circle at 100px 100px, #fff, #000);
  }

  @keyframes rotate {
    0% {background-position: 0 0;}
    100% {background-position: 630px 0;}
  }
</style>
