<template>
  <div class="card-event">

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class CardEvent extends Vue {}
</script>

<style scoped>
.card-event {
  height: 6rem;
  width: 10rem;
  border: 0.125rem solid #F5F5F5;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
