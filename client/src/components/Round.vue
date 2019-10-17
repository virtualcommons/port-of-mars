<template>
  <div class="round">
    <p>Round <span class="round-number">1</span></p>
    <!-- will need to re-render on props -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class Round extends Vue {}
</script>

<style scoped>
.round {
  /* display: flex; */
  /* background-color: blue; */
  color: #F5F5F5;
  font-size: 1.5rem;
}

.round p {
  margin: 0;
}
</style>
