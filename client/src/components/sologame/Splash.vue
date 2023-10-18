<template>
  <div class="d-flex flex-column align-items-center justify-content-center p-3 h-100 solo-game">
    <div class="w-75 mb-5">
      <h4>Port of Mars: Solo Mode</h4>
      <p>
        In this Port of Mars solo game you must balance investing resources for yourself versus
        investing in the maintenance of your habitat's life support systems, called
        <b>System Health</b>. There'll be a limited number of rounds where you can invest your time
        in System Health or keep them for yourself to earn Points.
      </p>
      <div class="cell w-75 mx-auto mb-3 p-3">
        <SegmentedBar class="mb-3" :min="0" :max="7" :asInput="true" v-model="demoValue" />
        <p class="text-center text-secondary">
          <span> Change your investment by clicking, dragging, or using the arrow keys </span>
          <span>
            <b-icon-arrow-left-square-fill class="mx-2" scale="1.3"></b-icon-arrow-left-square-fill>
            <b-icon-arrow-right-square-fill scale="1.3"></b-icon-arrow-right-square-fill>
          </span>
        </p>
        <p class="text-center mb-0">
          <span class="text-secondary">Press </span>
          <span class="bg-secondary text-black rounded px-1">Enter</span>
          <span class="text-secondary"> to submit your investment and </span>
          <span class="bg-secondary text-black rounded px-1">Space</span>
          <span class="text-secondary"> to continue through events</span>
        </p>
      </div>
      <p>
        Whatever you don't invest in System Health will be converted to Points and added to your
        Total Points. In other words, the more you invest in System Health, the less Points you will
        earn, and vice versa. If System Health drops to 0, your life support systems will fail and
        the game will end.
      </p>
      <p>
        On each round after the first round, random event cards will be drawn that can have a
        variety of effects on the game.
      </p>
    </div>
    <p>Click Start to begin Port of Mars: Solo Mode</p>
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
export default class Splash extends Vue {
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
