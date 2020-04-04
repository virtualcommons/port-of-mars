<template>
  <div class="w-100 h-100 d-flex justify-content-center align-items-center">
    <ContainerGame
      v-if="gamePhase !== phase.victory && gamePhase !== phase.defeat"
    />
    <ContainerVictory v-else-if="gamePhase === phase.victory" />
    <ContainerDefeat v-else-if="gamePhase === phase.defeat" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Phase } from '@port-of-mars/shared/types';
import ContainerGame from '@port-of-mars/client/components/root/ContainerGame.vue';
import ContainerDefeat from '@port-of-mars/client/components/root/ContainerDefeat.vue';
import ContainerVictory from '@port-of-mars/client/components/root/ContainerVictory.vue';

@Component({
  components: {
    ContainerGame,
    ContainerDefeat,
    ContainerVictory,
  },
})
export default class GameDashboard extends Vue {
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
}
</script>

<style lang="scss" scoped></style>
