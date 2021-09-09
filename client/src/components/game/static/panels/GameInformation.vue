<template>
  <b-row class="h-100 my-2 flex-column justify-content-center align-items-start"
         style="color: rgb(34, 26, 27)"
  >
    <b-col class="w-100 py-0 my-0">
      <p class="py-0 my-0 title">
        Round
      </p>
      <p class="subtitle">
        {{ roundNumber }}
      </p>
    </b-col>
    <b-col class="w-100 py-0 my-0">
      <p class="py-0 my-0 title">Current Phase</p>
      <p class="py-0 my-0 phase-number">{{ phaseNumber + 1 }} of 6</p>
      <p class="subtitle">{{ phaseText }}</p>
    </b-col>
    <b-col class="w-100 py-0 my-0">
      <p class="py-0 my-0 title">Phase Countdown</p>
      <p :class="countdownStyling">{{ timeRemaining }}</p>
    </b-col>
    <b-col class="w-100 my-0 py-0">
      <button
        @click="submitDone"
        class="ready-button tour-ready-to-advance-button"
        v-if="!playerReady"
      >
        Ready to Advance
      </button>
      <button @click="submitCancel" v-if="playerReady" class="cancel-button">
        Cancel Readiness
      </button>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';
import { Phase, PHASE_LABELS } from '@port-of-mars/shared/types';
import {AbstractGameAPI} from "@port-of-mars/client/api/game/types";

@Component({
  components: {},
})
export default class GameInformation extends Vue {
  @Inject() private api!: AbstractGameAPI;

  get roundNumber() {
    const { round, systemHealth } = this.$tstore.state;
    if (round > 0 && systemHealth > 0) {
      return round;
    } else if (systemHealth <= 0) {
      return 'Over';
    } else {
      return 'Pregame';
    }
  }

  get phaseNumber(): Phase {
    const phaseNumber = this.$tstore.state.phase;
    return phaseNumber ? phaseNumber : 0;
  }

  get phaseText() {
    return this.phaseNumber !== Phase.events
      ? PHASE_LABELS[this.phaseNumber]
      : `Event ${this.$tstore.state.marsEventsProcessed + 1}`;
  }

  get playerReady() {
    return this.$tstore.getters.player.ready;
  }

  get timeRemaining() {
    const fromState = this.$tstore.state.timeRemaining;
    const minutesRemaining = Math.floor(fromState / 60);
    const minutesRemainingDisplay = `${minutesRemaining}`.padStart(2, '0');
    const secondsRemainingDisplay = `${
      fromState - minutesRemaining * 60
    }`.padStart(2, '0');
    const timeRemaining = `${minutesRemainingDisplay}:${secondsRemainingDisplay}`;
    return timeRemaining ? timeRemaining : '00:00';
  }

  get countdownStyling() {
    return this.$tstore.state.timeRemaining < 60 ? 'blink-timer' : 'countdown';
  }

  submitDone() {
    let pendingInvestments;

    switch (this.phaseNumber) {
      // FIXME: change to using a queue system where other components can push pending api calls to
      //  queue. Submitting would flush the queue
      case Phase.events:
        const currentEvent = this.$tstore.getters.currentEvent;
        pendingInvestments = this.$tstore.getters.player.pendingInvestments;
        if (currentEvent && currentEvent.id === 'breakdownOfTrust') {
          this.api.saveBreakdownOfTrust(pendingInvestments);
        }
      case Phase.invest:
        pendingInvestments = this.$tstore.getters.player.pendingInvestments;
        this.api.investTimeBlocks(pendingInvestments);
      default:
        this.api.setPlayerReadiness(true);
    }

  }

  submitCancel() {
    this.api.setPlayerReadiness(false);
  }
}
</script>

<style lang="scss" scoped>
button {
  @include space-button;
  font-size: $font-med;
  font-weight: $bold !important;
}

button.ready-button,
button.cancel-button {
  position: relative;
  overflow: hidden;
}

button.ready-button {
  border: 0.125rem solid $light-accent;
  color: $dark-shade;
  background-color: $light-accent;
}

button.cancel-button {
  border: 0.125rem solid $light-shade;
  color: $dark-shade;
  background-color: $light-shade;
}

button.ready-button:after {
  animation: glint 5s linear 0s infinite forwards;
  //animation: name duration timing-function delay iteration-count direction fill-mode;

  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background: linear-gradient(
      to bottom,
      transparent,
      rgba(240, 218, 177, 0.5),
      50%,
      transparent
  );
  transform: rotateZ(120deg) translate(-1em, 4em);
  @keyframes glint {
    10%,
    100% {
      transform: rotateZ(120deg) translate(0, -5em);
    }
  }
}

.title {
  color: $light-shade-5;
  font-size: $font-med;
  font-weight: $bold;
}

.subtitle {
  color: $light-shade;
  font-size: $font-large;
  font-weight: $bold;
}

.phase-number {
  color: $light-shade;
  font-size: $font-med;
  font-weight: $bold;
}

.countdown {
  color: $light-shade;
  font-size: $font-large;
  transition: all 0.15s ease-in-out;
}

.blink-timer {
  animation: blinker 0.5s linear 5;
  color: $status-red;
  font-size: $font-large;
  font-weight: $bold;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}

</style>
