<template>
  <b-container fluid class="h-100 p-0 m-0">
    <b-row class="h-100 w-100 p-0 m-0">
      <b-col v-if="! isGameOver" class="h-100 w-100 m-0 p-0">
        <GameboardContainer></GameboardContainer>
      </b-col>
      <b-col v-else class="h-100 w-100 m-0 p-0">
        <GameOver></GameOver>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GameboardContainer from "@port-of-mars/client/components/root/GameboardContainer.vue";
import GameOver from "@port-of-mars/client/components/root/GameOver.vue";
import { Phase } from "@port-of-mars/shared/types";

@Component({
  components: {
    GameboardContainer,
    GameOver,
  }
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

  get isGameOver() {
    return [Phase.defeat, Phase.victory].includes(this.gamePhase);
  }
  
}
</script>
