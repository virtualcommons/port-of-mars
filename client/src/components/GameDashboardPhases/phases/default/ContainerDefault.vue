<template>
  <div class="container-default">
    <p>Welcome to Port of Mars</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class ContainerDefault extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/GameDashboardPhases/phases/default/ContainerDefault.scss';
</style>
