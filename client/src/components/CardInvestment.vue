<template>
  <div class="card-investment">

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class CardInvestment extends Vue {};
</script>

<style scoped>
  .card-investment {
    height: 6rem;
    width: 10rem;
    border: 0.125rem solid #F5F5F5;
    border-radius: 15%;
    justify-content: center;
    align-items: center;
  }
</style>
