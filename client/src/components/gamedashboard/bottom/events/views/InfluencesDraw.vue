<template>
  <div class="event-select-influences">
    <p>Please select one influence:</p>

    <div class="event-select-influences-select">
      <div
        class="event-select-influences-select-influence"
        v-for="influence in availableInfluences"
        :key="influence"
      >
        <img
          @click="handleDrawInfluence(influence)"
          :src="require(`@/assets/icons/${influence}.svg`)"
          alt="Investment"
        />
        <!-- <p>{{ investment.units }}</p> -->
      </div>
    </div>

    <p>Chosen</p>

    <div v-if="drawnInfluence === 'None Selected'" class="selected-placeholder">
      <p>None Selected</p>
    </div>

    <div class="event-select-influences-selected" v-else-if="drawnInfluence !== 'None Selected'">
      <div class="event-select-influences-selected-influence">
        <img
          @click="handleUndrawInfluence"
          :src="require(`@/assets/icons/${drawnInfluence}.svg`)"
          alt="Investment"
        />
      </div>
    </div>

    <button type="button" name="Submit Button" @click="submitDrawnInfluence">Done</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, InjectReactive } from 'vue-property-decorator';
import { Role, ROLES, Resource } from '@port-of-mars/shared/types';
import { GameRequestAPI } from '@/api/game/request';

@Component({})

export default class InfluencesDraw extends Vue {

  private drawnInfluence: string = 'None Selected';
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
    return ['science', 'government', 'legacy', 'finance', 'culture'];
  }

  /**
   * Changes the influence that the Player selected.
   * @param influence The influence that the Player votes for.
   *
   */
  private handleDrawInfluence(influence: string): void {
    this.drawnInfluence = influence;
    console.log('DRAW (type): ', typeof influence);
    console.log('DRAW: ', influence);
  }

  /**
   * Sets default influence if the Player has not selected an
   * influence category.
   *
   */
  private handleUndrawInfluence(): void {
    this.drawnInfluence = 'None Selected';
  }

  /**
   * Passes the influence that the Player selected to a request api.
   *
   */
  private submitDrawnInfluence(): void {
    const influenceChoice: Resource = this.drawnInfluence as Resource;
    const influenceVoteResults = { role: this.playerRole, influence: influenceChoice };
    this.api.saveBondingThroughAdversitySelection(influenceVoteResults);
    console.log('SUBMIT DRAWN INFLUENCE: ', this.drawnInfluence);
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/events/views/InfluencesDraw.scss';
</style>
