<template>
  <div class="container-top">
    <ContainerUpkeep />
    <ContainerPhase />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ContainerUpkeep from '@/components/gamedashboard/top/containers/ContainerUpkeep.vue';
import ContainerPhase from '@/components/gamedashboard/top/containers/ContainerPhase.vue';

@Component({
  components: {
    ContainerUpkeep,
    ContainerPhase
  }
})
export default class ContainerTop extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/top/containers/ContainerTop.scss';
</style>
