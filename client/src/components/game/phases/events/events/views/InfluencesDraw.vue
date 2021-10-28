<template>
  <div class="event-select-influences py-4">
    <p><strong>Select one Influence:</strong></p>

    <div class="event-select-influences-select pt-3">
      <div
        class="event-select-influences-select-influence"
        v-for="influence in availableInfluences"
        :key="influence"
      >
        <img
          @click="handleDrawInfluence(influence)"
          :src="require(`@port-of-mars/client/assets/icons/${influence}.svg`)"
          alt="Investment"
          v-b-tooltip.hover.bottom="influence"
        />
      </div>
    </div>

    <p><strong>You selected:</strong></p>

    <div v-if="drawnInfluence === 'None Selected'" class="selected-placeholder py-2">
      <p>None Selected</p>
    </div>

    <div class="event-select-influences-selected" v-else-if="drawnInfluence !== 'None Selected'">
      <div class="event-select-influences-selected-influence">
        <img
          @click="handleUndrawInfluence"
          :src="require(`@port-of-mars/client/assets/icons/${drawnInfluence}.svg`)"
          alt="Investment"
          v-b-tooltip.hover.bottom="'Click to clear selection'"
        />
      </div>
    </div>

    <button @click="submitDrawnInfluence">Done</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, InjectReactive } from "vue-property-decorator";
import { Role, Resource } from "@port-of-mars/shared/types";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";

@Component({})
export default class InfluencesDraw extends Vue {
  drawnInfluence: string = "None Selected";
  @Inject() api!: GameRequestAPI;

  /**
   * Gets the state of the current Player's role.
   * @return The Role.
   *
   */
  get playerRole(): Role {
    return this.$tstore.state.role;
  }

  /**
   * Gets the influence categories from which a player can choose.
   * @return String array of influences
   *
   */
  get availableInfluences(): Array<string> {
    return ["science", "government", "legacy", "finance", "culture"];
  }

  /**
   * Changes the influence that the Player selected.
   * @param influence The influence that the Player votes for.
   *
   */
  handleDrawInfluence(influence: string): void {
    this.drawnInfluence = influence;
    console.log("DRAW (type): ", typeof influence);
    console.log("DRAW: ", influence);
  }

  /**
   * Sets default influence if the Player has not selected an
   * influence category.
   *
   */
  handleUndrawInfluence(): void {
    this.drawnInfluence = "None Selected";
  }

  /**
   * Passes the influence that the Player selected to a request api.
   */
  submitDrawnInfluence(): void {
    const influenceChoice: Resource = this.drawnInfluence as Resource;
    const influenceVoteResults = { role: this.playerRole, influence: influenceChoice };
    this.api.saveBondingThroughAdversitySelection(influenceVoteResults);
    this.api.setPlayerReadiness(true);
    console.log("SUBMIT DRAWN INFLUENCE: ", this.drawnInfluence);
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/phases/events/events/views/InfluencesDraw.scss";
</style>
