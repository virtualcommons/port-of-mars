<template>
  <div class="c-game-dashboard">
    <GameboardContainer
      v-if="gamePhase !== phase.defeat && gamePhase !== phase.victory"
    />
    <Defeat v-if="gamePhase === phase.defeat" />
    <Victory v-if="gamePhase === phase.victory" />
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator';
  import GameboardContainer from '@port-of-mars/client/components/root/GameboardContainer.vue';
  import Victory from '@port-of-mars/client/components/root/Victory.vue';
  import Defeat from '@port-of-mars/client/components/root/Defeat.vue';
  import { Phase } from '@port-of-mars/shared/types';
  @Component({
    components: {
      GameboardContainer,
      Victory,
      Defeat,
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
