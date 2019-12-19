<template>
  <div class="container-top">
    <ContainerUpkeep />
    <ContainerPhase />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ContainerUpkeep from '@/components/gamedashboard/containers/ContainerUpkeep.vue';
import ContainerPhase from '@/components/gamedashboard/containers/ContainerPhase.vue';

@Component({
  components: {
    ContainerUpkeep,
    ContainerPhase
  }
})
export default class ContainerTop extends Vue {}
</script>

<style scoped>
.container-top {
  height: 100%;
  width: 100%;
  padding: 0 0.5rem 0.5rem 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
