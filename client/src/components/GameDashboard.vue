<template>
  <div>
    <div
      v-if="gamePhase != phase.defeat && gamePhase != phase.victory"
      class="game-dashboard"
    >
      <ModalController/>
      <GameboardContainer />
    </div>
    <div v-else-if="gamePhase == phase.defeat" class="game-dashboard-defeat">
      <ContainerDefeat />
    </div>
    <div v-else-if="gamePhase == phase.victory" class="game-dashboard-victory">
      <ContainerVictory />
    </div>
    <div class="gameboard-popups">
      <ActiveEventsPopup />
      <InventoryPopup />
      <MarsLogPopup />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Phase } from '@port-of-mars/shared/types';
import { EnvironmentMode } from '@port-of-mars/client/settings';
import ModalController from '@port-of-mars/client/components/game/modals/ModalController.vue';
import GameboardContainer from '@port-of-mars/client/components/root/GameboardContainer.vue';
import ContainerDefeat from '@port-of-mars/client/components/root/ContainerDefeat.vue';
import ActiveEventsPopup from "@port-of-mars/client/components/game/static/popups/ActiveEventsPopup.vue";
import InventoryPopup from "@port-of-mars/client/components/game/static/popups/InventoryPopup.vue";
import MarsLogPopup from "@port-of-mars/client/components/game/static/popups/MarsLogPopup.vue";
import {isDev, isStaging} from "@port-of-mars/shared/settings";

@Component({
  components: {
    ModalController,
    GameboardContainer,
    ContainerDefeat,
    ActiveEventsPopup,
    InventoryPopup,
    MarsLogPopup
  }
})
export default class GameDashboard extends Vue {
  env: EnvironmentMode = new EnvironmentMode();

  get phase() {
    return Phase;
  }

  get isDevModeEnabled() {
    return isDev() || isStaging();
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
@import "@port-of-mars/client/stylesheets/views/GameDashboard.scss";
</style>
