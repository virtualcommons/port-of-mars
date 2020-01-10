<template>
  <div class="phase-component">
    <Round />
    <div>
      <p class="title">Current Phase</p>
      <p class="current">{{ label }}</p>
      <div v-if="btnVisibility" class="buttons">
        <button
          class="donebtn"
          @click="submitDone"
          :disabled="btnDisabled"
          type="button"
          name="Phase Done Button"
        >
          Done
        </button>
        <font-awesome-icon
          class="cancelbtn"
          @click="submitCancel"
          v-if="playerReady == true && btnVisibility"
          :icon="['far', 'times-circle']"
          size="sm"
        />
      </div>
    </div>
    <p class="time">{{ timeRemaining }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator';
import Round from '@/components/gamedashboard/top/Round.vue';
import { PHASE_LABELS } from 'shared/types';
import ModalConfirmation from '@/components/gamedashboard/global/modals/ModalConfirmation.vue';
import * as s from 'shared/types';
import { GameRequestAPI } from '@/api/game/request';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons/faTimesCircle';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTimesCircle);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {
    ModalConfirmation,
    Round
  }
})
export default class Phase extends Vue {
  @Inject() private $api!: GameRequestAPI;

  private btnDisabled = false;

  get label() {
    const lbl = PHASE_LABELS[this.$tstore.state.phase];
    if (this.$store.state.phase === s.Phase.events) {
      return `${lbl} (${this.$tstore.state.marsEventsProcessed})`
    }
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
    let ready = this.$tstore.state.players[this.$tstore.state.role].ready;
    return ready;
  }

  submitDone() {
    switch (this.phase) {
      case s.Phase.invest:
        this.$api.investTimeBlocks(this.$tstore.getters.player.pendingInvestments);
      default:
        this.btnDisabled = true;
        this.$api.setPlayerReadiness(true);
        console.log(
          `DISABLED: ${this.btnDisabled}, READINESS: ${
            this.$tstore.state.players[this.$tstore.state.role].ready
          }`
        );
    }
  }

  submitCancel() {
    switch (this.phase) {
      case s.Phase.invest:
      // handle uninvest timeblocks
      default:
        this.btnDisabled = false;
        this.$api.setPlayerReadiness(false);
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

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/top/Phase.scss';
</style>
