<template>
  <div>
    <div
      v-if="gamePhase != phase.defeat && gamePhase != phase.victory"
      class="game-dashboard"
    >
      <MasterComponent />
      <ModalContainer />
      <ContainerBoard />
    </div>
    <div v-else-if="gamePhase == phase.defeat" class="game-dashboard-defeat">
      <ContainerDefeat />
    </div>
    <div v-else-if="gamePhase == phase.victory" class="game-dashboard-victory">
      <ContainerVictory />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Phase } from 'shared/types';
import MasterComponent from '@/components/MasterComponent.vue';
import ModalContainer from '@/components/gamedashboard/global/modals/ModalContainer.vue';
import ContainerBoard from '@/components/gamedashboard/global/containers/ContainerBoard.vue';
import ContainerDefeat from '@/components/gamedashboard/global/containers/ContainerDefeat.vue';
import ContainerVictory from '@/components/gamedashboard/global/containers/ContainerVictory.vue';

@Component({
  components: {
    MasterComponent,
    ModalContainer,
    ContainerBoard,
    ContainerDefeat,
    ContainerVictory
  }
})
export default class GameDashboard extends Vue {
  get phase() {
    return Phase;
  }

  get gamePhase() {
    return this.$store.state.phase;
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/views/GameDashboard.scss';
</style>
