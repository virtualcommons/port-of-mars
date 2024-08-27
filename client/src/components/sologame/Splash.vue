<template>
  <div class="d-flex flex-column justify-content-center align-items-center p-3 h-100 solo-game">
    <b-row class="mb-5">
      <b-col md class="px-5 d-flex flex-column justify-content-between">
        <span class="text-center">
          <h4 v-if="isFreeplay">Port of Mars: Solo Mode</h4>
          <h4 v-else-if="isProlificBaseline">Game 1</h4>
          <h4 v-else-if="isProlificVariable">Game 2</h4>
        </span>
        <p v-if="isFreeplay">
          In this Port of Mars solo game you must balance investing resources for yourself versus
          investing in the maintenance of your habitat's life support systems, called
          <b>System Health</b>. There'll be a limited number of rounds where you can invest your
          time in System Health or keep them for yourself to earn Points.
        </p>
        <p v-else-if="isProlificBaseline">
          In this game you must balance investing resources for yourself versus investing in the
          maintenance of a support system, called <b>System Health.</b> There'll be
          <b>eight rounds</b> where you can invest your time in System Health or keep them for
          yourself to earn Points.
        </p>
        <p v-else-if="isProlificVariable">
          In this game you must also balance investing resources for yourself versus investing in
          the maintenance of a support systems, called <b>System Health.</b> There'll be a limited
          number of rounds where you can invest your time in System Health or keep them for yourself
          to earn Points.
        </p>
        <p>
          Whatever you don't invest in System Health will be converted to Points and added to your
          Total Points. In other words, the more you invest in System Health, the less Points you
          will earn, and vice versa. If System Health drops to 0, your life support systems will
          fail and the game will end.
        </p>
        <p v-if="isFreeplay || isProlificVariable">
          On each round after the first round, random event cards will be drawn that can have a
          variety of effects on the game.
        </p>
        <p v-if="isProlificBaseline || isProlificVariable">
          Each Point earned will be 1 cent in the final payment.
        </p>
      </b-col>
      <b-col md class="d-flex flex-column align-items-center px-5">
        <h4>Controls</h4>
        <div class="cell w-100 mx-auto mb-3 p-3">
          <SegmentedBar class="mb-3" :min="0" :max="3" :asInput="true" v-model="demoValue" />
          <span class="text-secondary">
            <p><b>Play with your cursor or use the following key bindings</b></p>
            <p>
              <b-icon-arrow-left-square-fill
                class="mx-1"
                scale="1.3"
              ></b-icon-arrow-left-square-fill>
              Decrease investment
            </p>
            <p>
              <b-icon-arrow-right-square-fill
                class="mx-1"
                scale="1.3"
              ></b-icon-arrow-right-square-fill>
              Increase investment
            </p>
            <p>
              <span class="bg-secondary text-black rounded px-1 mr-1">ENTER</span>
              Submit your investment
            </p>
            <p class="mb-0">
              <span class="bg-secondary text-black rounded px-1 mr-1">SPACE</span>
              Continue through events
            </p>
          </span>
        </div>
      </b-col>
    </b-row>
    <b-button variant="primary" size="lg" class="px-5" @click="begin" :disabled="starting">
      <h4 class="mb-0">Start</h4>
    </b-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { SoloGameType } from "@port-of-mars/shared/sologame";
import SegmentedBar from "@port-of-mars/client/components/sologame/SegmentedBar.vue";

@Component({
  components: {
    SegmentedBar,
  },
})
export default class Splash extends Vue {
  @Prop({ default: "freeplay" }) gameType!: SoloGameType;

  starting = false;
  demoValue = 0;

  get isFreeplay() {
    return this.gameType === "freeplay";
  }

  get isProlificBaseline() {
    return this.gameType === "prolificBaseline";
  }

  get isProlificVariable() {
    return this.gameType === "prolificVariable";
  }

  begin() {
    this.starting = true;
    this.$emit("begin");
  }
}
</script>
