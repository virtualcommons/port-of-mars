<template>
  <div class="statusbar-outer">

  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class StatusBar extends Vue {};
</script>

<style lang="css" scoped>
.statusbar-outer {
  height: 1rem;
  flex-grow: 100;
  border: 0.125rem solid #F5F5F5;
  border-radius: 0.50rem;
}
</style>
