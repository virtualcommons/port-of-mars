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
  width: 100%;
  font-size: 1.5rem;
  color: #F5F5F5;
}

.round p {
  text-align: left;
  margin-bottom: 1rem;
}
</style>
