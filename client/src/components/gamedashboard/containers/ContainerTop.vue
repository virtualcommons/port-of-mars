<template>
  <div class="container-top">
    <ContainerUpkeep id="v-step-6" />
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
    ContainerPhase,

  },
})

export default class ContainerTop extends Vue {}
</script>

<style scoped>
.container-top {
  padding: 1rem 1rem 0 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
  /* background-color: purple; */
}
</style>
