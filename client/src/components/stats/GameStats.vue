<template>
  <b-row>
    <b-col>
      <h4>
        <b-badge class="">{{ formattedDate }} </b-badge>
      </h4>
      <b-list-group horizontal class="content-container mb-3">
        <b-list-group-item :class="status === 'Victory' ? 'bg-success' : 'bg-politician'">
          <span class="score">
            {{ status }}
          </span>
        </b-list-group-item>
        <b-list-group-item
          v-for="playerScore in playerStatItem.playerScores"
          :key="playerScore.role"
          class="d-flex flex-fill justify-content-between align-items-center bg-dark"
        >
          <span class="score">
            {{ playerScore.role }}
            <b-icon-person-check-fill v-if="playerScore.isSelf" />
          </span>
          <span class="score mx-2">
            <b-badge pill :variant="getVariant(playerStatItem.victory, playerScore.winner)"
              >{{ playerScore.points }} points</b-badge
            >
          </span>
        </b-list-group-item>
      </b-list-group>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { PlayerStatItem } from "@port-of-mars/shared/types";

@Component({})
export default class GameStats extends Vue {
  @Prop() playerStatItem!: PlayerStatItem;

  get formattedDate() {
    return new Date(this.playerStatItem.time).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  getActive(victory: boolean, winner: boolean) {
    return victory && winner;
  }

  getVariant(victory: boolean, winner: boolean) {
    return victory && winner ? "success" : "secondary";
  }

  get status() {
    return this.playerStatItem.victory ? "Victory" : "Defeat";
  }
}
</script>
<style scoped>
.score {
  font-size: 1.2rem;
}
</style>
