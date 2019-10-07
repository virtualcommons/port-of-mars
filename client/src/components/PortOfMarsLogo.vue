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
  @import url('https://fonts.googleapis.com/css?family=Orbitron&display=swap');

  .title-container {
    display: flex;
    flex-direction: column;
    background: inherit;
    text-align: center;
    position: absolute;
    top: 10%;
  }

  .title {
    font-family: 'Orbitron', sans-serif;
    font-size: 50px;
    color: #ffddda;
    text-shadow: 0 0 20px #c90000,  0 0 20px #c90000;
  }
</style>
