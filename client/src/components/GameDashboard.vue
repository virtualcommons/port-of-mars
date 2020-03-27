<template>
  <div>
    <div
      v-if="gamePhase != phase.defeat && gamePhase != phase.victory"
      class="game-dashboard"
    >
      <MasterComponent v-if="environment == 'development'" />
      <ModalContainer />
      <ModalController/>
      <NewGameBoardContainer />
      
      <!-- <ContainerBoard /> -->
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
import { Phase } from '@port-of-mars/shared/types';
import { EnvironmentMode } from '@port-of-mars/client/settings';
import MasterComponent from '@port-of-mars/client/components/MasterComponent.vue';
import ModalContainer from '@port-of-mars/client/components/gamedashboard/global/modals/ModalContainer.vue';
// import ContainerBoard from '@port-of-mars/client/components/gamedashboard/global/containers/ContainerBoard.vue';
import NewGameBoardContainer from '@port-of-mars/client/components/gamedashboard/global/containers/NewGameBoardContainer.vue';
import ModalController from '@port-of-mars/client/components/gamedashboard/global/modals/ModalController.vue';
import ContainerBoard from '@port-of-mars/client/components/gamedashboard/global/containers/ContainerBoard.vue';
import ContainerDefeat from '@port-of-mars/client/components/gamedashboard/global/containers/ContainerDefeat.vue';
import ContainerVictory from '@port-of-mars/client/components/gamedashboard/global/containers/ContainerVictory.vue';
import environment from '../store/mutationFolder/environment';

@Component({
  components: {
    MasterComponent,
    ModalContainer,
    ContainerBoard,
    NewGameBoardContainer,
    ModalController,
    ContainerDefeat,
    ContainerVictory
  }
})
export default class GameDashboard extends Vue {
  env: EnvironmentMode = new EnvironmentMode();

  get phase() {
    return Phase;
  }

  /**
   * Gets the current phase of the game.
   * @returns The current phase.
   */
  get gamePhase() {
    return this.$tstore.state.phase;
  }

  /**
   * Gets the string value of the current environment.
   * @return The environment.
   *
   */
  get environment() {
    return this.env.environment;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/views/GameDashboard.scss';
</style>
