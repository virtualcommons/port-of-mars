<template>
  <div class="c-game-dashboard">
    <GameboardContainer
      v-if="gamePhase !== phase.defeat && gamePhase !== phase.victory"
    />
    <ContainerDefeat v-if="gamePhase === phase.defeat" />
    <ContainerVictory v-if="gamePhase === phase.victory" />
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import GameboardContainer from '@port-of-mars/client/components/root/GameboardContainer.vue';
  import ContainerVictory from '@port-of-mars/client/components/root/ContainerVictory.vue';
  import ContainerDefeat from '@port-of-mars/client/components/root/ContainerDefeat.vue';
  import { Phase } from '@port-of-mars/shared/types';
  @Component({
    components: {
      GameboardContainer,
      ContainerVictory,
      ContainerDefeat,
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

<style lang="scss" scoped>
  @import '@port-of-mars/client/stylesheets/views/GameDashboard.scss';
</style>
