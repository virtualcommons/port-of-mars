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
.container{
  height: 100%;
  width: 100%;
  max-width: none;
  color: var(--space-white);
  align-content: center;
}

.text{
    text-align: center;
}
</style>