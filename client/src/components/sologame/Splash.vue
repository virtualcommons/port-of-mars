<template>
  <div class="d-flex flex-column align-items-center justify-content-center p-3 h-100 solo-game">
    <div class="w-75 mb-5">
      <h4>How to Play</h4>
      <p>
        This is a simple investment game where your goal is to balance saving resources for yourself
        with keeping the system afloat. You will have a limited number of rounds to play, and each
        round you will be presented with a choice of how much of your limited resources to invest in
        maintaining the health of the system with a control module like this:
      </p>
      <div class="w-50 m-auto">
        <SegmentedBar :min="0" :max="7" :asInput="true" v-model="demoValue" />
        <p class="text-center">
          <i><small>Click, scroll, or drag to increase your investment</small></i>
        </p>
      </div>
      <p>
        The less you invest, the more points you will earn. If you invest too little, however, the
        system health will drop to zero and the game will end in defeat.
      </p>
      <p>
        On every round after the first, random event cards that can influence anything in the game
        will be drawn.
      </p>
    </div>
    <p>Ready?</p>
    <b-button variant="primary" size="lg" class="px-5" @click="begin" :disabled="starting">
      <h4 class="mb-0">Start</h4>
    </b-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { HOME_PAGE } from "@port-of-mars/shared/routes";
import SegmentedBar from "@port-of-mars/client/components/sologame/SegmentedBar.vue";

@Component({
  components: {
    SegmentedBar,
  },
})
export default class GameOver extends Vue {
  @Prop() status!: string;
  @Prop() points!: number;

  home = { name: HOME_PAGE };
  starting = false;
  demoValue = 0;

  begin() {
    this.starting = true;
    this.$emit("begin");
  }

  get isVictory() {
    return this.status === "victory";
  }
}
</script>
