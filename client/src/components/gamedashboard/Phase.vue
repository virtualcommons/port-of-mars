<template>
  <div class="phase-component" id="v-step-7">
    <div>
      <p class="phase-title">Current Phase</p>
      <p class="phase-current">{{ currentPhase }}</p>
    </div>
    <div>
      <p class="phase-time"><span>( </span>5<span> : </span>00<span> )</span></p>
    </div>
    <div v-if="btnVisibility">
      <button
        class="phase-donebtn"
        @click.prevent="handleClick"
        :disabled="btnDisabled"
        type="button"
        name="phase complete button"
      >
        Done
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import Clock from '@/components/gamedashboard/Clock.vue';

@Component({
  components: {
    Clock,
  },
})
export default class Phase extends Vue {
  get btnDisabled() {
    return this.$store.state.playerFinishedWithPhase;
  }

  get currentPhase() {
    return this.$store.state.gamePhase;
  }

  get btnVisibility() {
    switch (this.currentPhase) {
      case 'Time Blocks':
        return true;
      case 'Trading':
        return true;
      case 'Purchase Accomplishments':
        return true;
      default:
        return false;
    }
  }

  // Note: Do we want the ability to cancel?

  handleClick() {
    this.$store.dispatch('setPlayerFinished', true);
  }
}
</script>

<style scoped>
.phase-component {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 60%;
  /* background-color: var(--space-orange); */
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
  font-size: 0.75rem;
  border-radius: 0.5rem;
  border: var(--border-white);
  color: var(--space-white);
  background-color: var(--space-gray);
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
