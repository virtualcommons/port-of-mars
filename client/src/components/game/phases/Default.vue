<template>
  <div class="c-default container">
    <p>Welcome to Port of Mars</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class Default extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/Default.scss';
</style>
