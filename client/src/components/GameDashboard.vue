<template>
  <b-container fluid class="h-100 p-0 m-0">
    <b-row class="h-100 w-100 p-0 m-0">
      <b-col v-if="shouldDisplayGame" class="h-100 w-100 m-0 p-0">
        <GameboardContainer></GameboardContainer>
      </b-col>
      <b-col v-else-if="gamePhase === phase.defeat" class="h-100 w-100 m-0 p-0">
        <Defeat></Defeat>
      </b-col>
      <b-col v-else-if="gamePhase === phase.victory" class="h-100 w-100 m-0 p-0">
        <Victory></Victory>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GameboardContainer from "@port-of-mars/client/components/root/GameboardContainer.vue";
import Victory from "@port-of-mars/client/components/root/Victory.vue";
import Defeat from "@port-of-mars/client/components/root/Defeat.vue";
import { Phase } from "@port-of-mars/shared/types";

@Component({
  components: {
    GameboardContainer,
    Victory,
    Defeat
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

  get shouldDisplayGame() {
    return ![Phase.defeat, Phase.victory].includes(this.gamePhase);
  }
}
</script>
