<template>
  <div>
    <SegmentedBar
      :min="0"
      :max="state.player.resources"
      v-model="pendingSystemHealthInvestment"
      :asInput="true"
      :segment-class="{ 'glowing-shadow': shouldFlashInvestInput }"
    />

    <h5 class="text-segmented-reg">{{ pendingPointsValue }}</h5>
    <h5 class="text-segmented-itl">{{ pendingPointsValue }}</h5>
    <h5 class="text-segmented-reg">RESOURCES WILL BE DIVERTED TO POINTS.</h5>
    <h5 class="text-segmented-itl">RESOURCES WILL BE DIVERTED TO POINTS.</h5>
    <h5>RESOURCES WILL BE DIVERTED TO POINTS.</h5>
    <b-button
      @click="handleInvestButtonClick"
      :disabled="!state.canInvest"
      variant="success"
      block
      :class="{ 'glowing-shadow': shouldFlashInvestButton }"
      >Invest in System Health</b-button
    >
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import SegmentedBar from "@port-of-mars/client/components/global/SegmentedBar.vue";

@Component({
  components: {
    SegmentedBar,
  },
})
export default class Investment extends Vue {
  @Prop() state!: any; // FIXME: use SoloGameState type

  pendingSystemHealthInvestment = 0;

  get shouldFlashInvestButton() {
    return this.pendingSystemHealthInvestment > 0 && this.state.round === 1;
  }

  get shouldFlashInvestInput() {
    return this.pendingSystemHealthInvestment === 0 && this.state.round === 1;
  }

  get pendingPointsValue() {
    return this.state.player.resources - this.pendingSystemHealthInvestment;
  }

  handleInvestButtonClick() {
    this.$emit("invest", this.pendingSystemHealthInvestment);
    // FIXME: only reset to 0 if invest was successful
    this.pendingSystemHealthInvestment = 0;
  }
}
</script>

<style lang="scss">
.custom-font {
  font-family: "DSEG 14 Regular";
}
</style>
