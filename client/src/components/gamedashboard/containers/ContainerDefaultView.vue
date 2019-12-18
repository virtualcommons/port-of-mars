<template>
  <div class="container" cols="12">
    <div class="text">
      <p>Welcome to Port of Mars</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';

@Component({})
export default class ContainerDefault extends Vue {}
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  max-width: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--space-white);
}

.text p {
  margin-bottom: 0;
  font-size: var(--font-med);
  text-align: center;
  color: var(--space-white-opaque-2);
}
</style>
