<template>
  <div class="d-flex flex-column justify-content-center align-items-center p-3 h-100 solo-game">
    <div class="w-50">
      <div v-if="isVictory" class="mb-5">
        <h1 class="text-success">Success</h1>
        <p>
          You've successfully passed the rigors and challenges of this Port of Mars solo trial.
          Congratulations!
        </p>
      </div>
      <div v-else class="mb-5">
        <h1 class="text-danger">Simulation Failed</h1>
        <p>The simulated environment on Port of Mars is harsh and unforgiving. Please try again!</p>
      </div>
      <div class="d-flex mb-5">
        <div class="w-50 pr-3">
          <h4>Total Points Earned</h4>
          <div class="py-2 px-3 vfd-container">
            <VFDNumberDisplay
              :digits="2"
              :value="isVictory ? points : 0"
              variant="green"
              :size="3"
            />
          </div>
        </div>
        <div class="w-50 pl-3">
          <h4>Total Rounds</h4>
          <div class="py-2 px-3 vfd-container">
            <VFDNumberDisplay :digits="2" :value="round" variant="yellow" :size="3" />
          </div>
        </div>
      </div>
      <b-button variant="primary" size="lg" @click="reload" class="mr-3">
        <h4 class="mb-0">
          <b-icon-arrow-clockwise />
          Play again
        </h4>
      </b-button>
      <b-button variant="secondary" size="lg" @click="routeToHighscores"
        ><h4 class="mb-0">
          <b-icon-trophy scale="0.75" />
          High Scores
        </h4></b-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { LEADERBOARD_PAGE } from "@port-of-mars/shared/routes";
import VFDNumberDisplay from "@port-of-mars/client/components/sologame/VFDNumberDisplay.vue";

@Component({
  components: {
    VFDNumberDisplay,
  },
})
export default class GameOver extends Vue {
  @Prop() status!: string;
  @Prop() points!: number;
  @Prop() round!: number;

  get isVictory() {
    return this.status === "victory";
  }

  reload() {
    window.location.reload();
  }

  routeToHighscores() {
    this.$router.push({ name: LEADERBOARD_PAGE, params: { showSolo: true } as any });
  }
}
</script>
