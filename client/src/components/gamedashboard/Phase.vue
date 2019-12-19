<template>
  <div class="phase-component">
    <div>
      <p class="phase-title">Current Phase</p>
      <p class="phase-current">{{ label }}</p>
      <div v-if="btnVisibility" class="container-phase-btns">
        <button
          class="phase-donebtn"
          @click="submitDone"
          :disabled="btnDisabled"
          type="button"
          name="phase complete button"
        >
          Done
        </button>
        <i
          class="far fa-times-circle"
          @click="submitCancel"
          v-if="playerReady == true && btnVisibility"
        ></i>
      </div>
    </div>
    <div>
      <p class="phase-time">{{ timeRemaining }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator';
import Clock from '@/components/gamedashboard/Clock.vue';
import {PHASE_LABELS} from "shared/types";
import ConfirmationModal from "@/components/gamedashboard/ConfirmationModal.vue";
import * as s from 'shared/types'
import {GameRequestAPI} from "@/api/game/request";

@Component({
  components: {
    ConfirmationModal,
    Clock
  }
})
export default class Phase extends Vue {
  @Inject()
  private $api!: GameRequestAPI;

  private btnDisabled = false;

  get label() {
    return PHASE_LABELS[this.$tstore.state.phase];
  }

  get phase() {
    return this.$tstore.state.phase;
  }

  get btnVisibility() {
    switch (this.phase) {
      case s.Phase.invest:
        return true;
      case s.Phase.trade:
        return true;
      case s.Phase.purchase:
        return true;
      case s.Phase.discard:
        return true;
      default:
        return false;
    }
  }

  get playerReady() {
    return this.$tstore.state.players[this.$tstore.state.role].ready;
  }

  submitDone() {
    switch (this.phase) {
      case s.Phase.invest:
        this.$api.investTimeBlocks(this.$tstore.getters.player.pendingInvestments);
      default:
        this.btnDisabled = true;
        this.$tstore.commit('SET_READINESS', {
          data: true,
          role: this.$tstore.state.role
        });
    }
  }

  submitCancel() {
    switch (this.phase) {
      case s.Phase.invest:
      // handle uninvest timeblocks
      default:
        this.btnDisabled = false;
        this.$tstore.commit('SET_READINESS', {
          data: false,
          role: this.$tstore.state.role
        });
    }
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
  height: 100%;
  width: 100%;
  /* border: 0.125rem solid var(--space-white-opaque-2); */
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  text-align: center;
}

.phase-component i {
  color: var(--space-orange);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.phase-component i:hover {
  transform: scale(1.1);
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

.container-phase-btns {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.phase-donebtn {
  height: 1.5625rem;
  width: 6.25rem;
  padding: 0.125rem;
  margin-bottom: 0.5rem;
  border: var(--border-white);
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: var(--space-white);
  background-color: var(--space-gray);
  transition: all 0.2s ease-in-out;
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
