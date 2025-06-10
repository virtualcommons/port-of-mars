<template>
  <div class="w-100 text-center">
    <b-row class="mb-4">
      <b-col md class="px-4 d-flex flex-column text-center">
        <h4 v-if="currentSlide === 1">PORT OF MARS: MULTIPLAYER MODE</h4>
        <h4 v-if="currentSlide === 2">THE GAME</h4>
        <h4 v-if="currentSlide === 3">THE OBJECTIVE</h4>

        <p v-if="currentSlide === 1">
          In this Port of Mars multiplayer game, you will collaborate with other players to manage
          your habitat's resources while pursuing individual goals. Balance cooperation and
          competition to maximize your points while ensuring the survival of your habitat.
        </p>
        <p v-if="currentSlide === 1">
          Each player has limited actions per round. Use them wisely to invest in system health or
          achieve personal objectives. If system health drops to 0, the game ends for everyone.
        </p>

        <p v-if="currentSlide === 2">
          You are 1 of 3 residents at the Port of Mars, the first long-term habitat on the planet.
          Each game consists of 8-12 rounds, each with phases of investing and reacting to Mars
          events. Chance and player actions impact system health. If system health falls to zero,
          all players die.
        </p>

        <p v-if="currentSlide === 3">
          Your mission is to stay alive and achieve the most Points. In each round, you will
          normally receive 10 time-blocks that you can invest in System Health. System Health keeps
          your team alive. Time-blocks not invested in System Health earn you Points.
        </p>
      </b-col>
    </b-row>

    <!-- Buttons -->
    <div class="d-flex justify-content-center">
      <b-button
        variant="secondary"
        size="lg"
        @click="previousSlide"
        :disabled="currentSlide === 1"
        style="margin-right: 20px"
      >
        <h4 class="mb-0">Previous</h4>
      </b-button>

      <b-button
        v-if="currentSlide < 3"
        variant="danger"
        size="lg"
        @click="nextSlide"
        style="margin-right: 20px"
      >
        <h4 class="mb-0">Next</h4>
      </b-button>

      <b-button
        v-if="currentSlide === 3"
        variant="danger"
        size="lg"
        @click="handleStart"
        :disabled="starting"
      >
        <h4 class="mb-0">Start</h4>
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "Splash",
})
export default class Splash extends Vue {
  starting = false;
  currentSlide = 1;

  nextSlide() {
    if (this.currentSlide < 3) {
      this.currentSlide++;
    }
  }

  previousSlide() {
    if (this.currentSlide > 1) {
      this.currentSlide--;
    }
  }

  handleStart() {
    this.starting = true;
    this.$emit("pressed-start");
  }
}
</script>
