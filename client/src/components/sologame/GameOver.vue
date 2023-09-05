<template>
  <div class="d-flex flex-column justify-content-center align-items-center p-3 h-100 solo-game">
    <div class="w-50">
      <div v-if="isVictory" class="mb-5">
        <h1>Victory!</h1>
        <p>
          You succeeded in outlasting the challenges of Mars and were able to score enough for
          yourself.
        </p>
      </div>
      <div v-else class="mb-5">
        <h1>Game Over</h1>
        <p>
          You weren't able to withstand the harsh conditions and fell along with any points you
          racked up.
        </p>
      </div>
      <div class="d-flex mb-5">
        <div class="w-50 pr-3">
          <h4>Points Earned</h4>
          <div class="py-2 px-3 vfd-container">
            <VFDNumberDisplay :digits="2" :value="points" variant="green" :size="3" />
          </div>
        </div>
        <div class="w-50 pl-3">
          <h4>Rounds lasted</h4>
          <div class="py-2 px-3 vfd-container">
            <VFDNumberDisplay :digits="2" :value="round" variant="yellow" :size="3" />
          </div>
        </div>
      </div>
      <b-button variant="success" size="lg" @click="reload" class="mr-3">
        <h4 class="mb-0">
          <b-icon-arrow-clockwise />
          Play again
        </h4>
      </b-button>
      <b-button variant="primary" size="lg" :to="home" class="pl-1"
        ><h4 class="mb-0">
          <b-icon-chevron-left />
          Return home
        </h4></b-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { HOME_PAGE } from "@port-of-mars/shared/routes";
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

  home = { name: HOME_PAGE };

  get isVictory() {
    return this.status === "victory";
  }

  reload() {
    window.location.reload();
  }
}
</script>
