<template>
  <div class="asset">
    <div class="asset-left">
      <p class="asset-img">X</p>
      <p>Government</p>
    </div>
    <div class="asset-right">
      <p>1</p>
    </div>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class Asset extends Vue {};
</script>

<style scoped>
  .asset {
    width: 80%;
    margin-bottom: 1rem;
    /* background-color: blue; */
    display: flex;
    justify-content: space-between;
    /* border: 0.125rem solid #F5F5F5; */
  }

  .asset p {
    margin: 0;
  }

  .asset-img {
    margin-right: 1rem !important;
  }

  .asset-left {
    display: flex;
    align-items: center;
  }

  .asset-right {
    display: flex;
    align-items: center;
  }
</style>
