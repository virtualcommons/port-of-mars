<template>
  <div class="phase-component">
    <div>
      <p class="phase-title">Current Phase</p>
      <p class="phase-current">{{ currentPhase }}</p>
      <div v-if="btnVisibility">
        <button
          class="phase-donebtn v-step-14"
          @click="handleClick"
          :disabled="btnDisabled"
          type="button"
          name="phase complete button"
        >
          Done
        </button>
      </div>
    </div>
    <div>
      <p class="phase-time"><span>( </span>{{ timeRemaining }}<span> )</span></p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Clock from '@/components/gamedashboard/Clock.vue';
import {PHASE_LABELS} from "shared/types";

@Component({
  components: {
    Clock,
  },
})
export default class Phase extends Vue {
  private btnDisabled = false;

  get currentPhase() {
    return PHASE_LABELS[this.$tstore.state.gamePhase];
  }

  get btnVisibility() {
    switch (this.currentPhase) {
      case 'Investment':
        return true;
      case 'Trading':
        return true;
      case 'Purchase Accomplishments':
        return true;
      default:
        return false;
    }
  }

  handleClick() {
    this.$root.$emit('openConfirmation', {text:`Select 'Yes' if you're ready to end the round.`,type:'nextRound'});
    // this.btnDisabled = true;
  }

  get timeRemaining() {
    const tr = this.$store.state.timeRemaining;
    const minutesRemaining = Math.floor(tr / 60);
    const minutesRemainingDisplay = `${minutesRemaining}`.padStart(2, '0');
    const secondsRemainingDisplay = `${tr - minutesRemaining * 60}`.padStart(2, '0');
    return `${minutesRemainingDisplay}:${secondsRemainingDisplay}`;
  }
}
</script>

<style scoped>
.phase-component {
  height: 80%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
}

.phase-component p {
  margin: 0;
}

.phase-title {
  font-size: var(--font-large);
  color: var(--space-white);
}

.phase-current {
  font-size: var(--font-med);
  color: var(--space-orange);
}

.phase-donebtn {
  height: 1.5625rem;
  width: 6.25rem;
  padding: 0.125rem;
  margin-top: 0.75rem;
  border: var(--border-white);
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: var(--space-white);
  background-color: var(--space-gray);
  transition: all .2s ease-in-out;
}

.phase-donebtn:hover {
  color: var(--space-gray);
  background-color: var(--space-white);
}

.phase-donebtn:focus {
  outline: none !important;
}

.phase-donebtn:disabled {
  opacity: 50%;
}

.phase-donebtn:disabled:hover {
  color: var(--space-white);
  background-color: var(--space-gray);
}

.phase-time {
  font-size: var(--font-large);
  color: var(--space-orange);
}

.phase-time span {
  color: var(--space-white);
}
</style>
