<template>
  <div class="title-container">
    <h1 class="title">PORT OF MARS</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class PortOfMarsLogo extends Vue {
}
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Orbitron|Share+Tech+Mono|Space+Mono&display=swap');

  .title-container {
    display: flex;
    flex-direction: column;
    background: inherit;
    text-align: center;
    position: absolute;
    top: 10%;
  }

  .title {
    /*font-family: var(--font-family-default);*/
    font-family: 'Share Tech Mono', monospace;
    /*font-family: 'Orbitron', sans-serif;*/
    font-size: 50px;
    color: #ffddda;
    text-shadow: 0 0 20px #c90000,  0 0 20px #c90000;
  }

  .title-container h1 {
    overflow: hidden; /* title not revealed until animation */
    border-right: .15em solid #4b0000; /* typewriter cursor in dark red */
    white-space: nowrap; /* keep title in single line */
    margin: 0 auto; /* scrolling effect as typing occurs */
    letter-spacing: 0.5em;
    animation:
      typing 3.5s steps(40, end),
      blink-caret .75s step-end infinite;
  }

  /* typing animation effect */
  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }

  /* typewriter blinking cursor animation */
  @keyframes blink-caret {
    from, to { border-color: transparent }
    50% { border-color: #4b0000; }
  }
</style>
