<template>
  <div class="c-gameinformation">
    <div class="section tour-round">
      <p class="title" >Round</p>
      <p class="round">{{ roundNumber }}</p>
    </div>
    <div class="section tour-container-top">
      <p class="title" >Current Phase</p>
      <p class="number">{{ phaseNumber }} of 5</p>
      <p class="phase">{{ phaseText }}</p>
    </div>
    <div class="section">
      <p class="title">Phase Countdown</p>
      <p :class="countdownStyling">{{ timeRemaining }}</p>
    </div>
    <div class="section tour-ready-to-advance-button">
      <button @click="submitDone" class="ready-button" v-if="!playerReady">Ready to Advance</button>
      <button @click="submitCancel" v-if="playerReady">Cancel Readiness</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { Phase, PHASE_LABELS } from '@port-of-mars/shared/types';

@Component({
  components: {}
})
export default class GameInformation extends Vue {
  @Inject() private api!: GameRequestAPI;

  get roundNumber() {
    const { round, upkeep } = this.$store.state;
    if (round > 0 && upkeep > 0) {
      return round;
    } else if (upkeep <= 0) {
      return 'Over';
    } else {
      return 'Pregame';
    }
  }

  get phaseNumber(): Phase {
    const phaseNumber = this.$store.state.phase;
    return phaseNumber ? phaseNumber : 0;
  }

  get phaseText() {
    return this.phaseNumber !== Phase.events
      ? PHASE_LABELS[this.phaseNumber]
      : `Event ${this.$tstore.state.marsEventsProcessed + 1}`;
  }

  get playerReady() {
    return this.$store.getters.player.ready;
  }

  get timeRemaining() {
    const fromState = this.$store.state.timeRemaining;
    const minutesRemaining = Math.floor(fromState / 60);
    const minutesRemainingDisplay = `${minutesRemaining}`.padStart(2, '0');
    const secondsRemainingDisplay = `${fromState -
      minutesRemaining * 60}`.padStart(2, '0');
    const timeRemaining = `${minutesRemainingDisplay}:${secondsRemainingDisplay}`;
    return timeRemaining ? timeRemaining : '00:00';
  }

  get countdownStyling() {
    return this.$store.state.timeRemaining < 60 ? 'blink-timer' : 'countdown';
  }

  private submitDone() {
    let pendingInvestments;
    switch (this.phaseNumber) {
      case Phase.events:
        const currentEvent = this.$tstore.getters.currentEvent;
        pendingInvestments = this.$tstore.getters.player.pendingInvestments;
        if (currentEvent && currentEvent.id === 'breakdownOfTrust') {
          this.api.saveResourcesSelection(pendingInvestments);
        }
      case Phase.invest:
        pendingInvestments = this.$tstore.getters.player.pendingInvestments;
        this.api.investTimeBlocks(pendingInvestments);
      default:
        this.api.setPlayerReadiness(true);
    }
  }

  private submitCancel() {
    this.api.setPlayerReadiness(false);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/static/panels/GameInformation.scss';
</style>
