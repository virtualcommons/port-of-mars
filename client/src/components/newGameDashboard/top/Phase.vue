<template>
  <div class="phase-component">
    <Round />
    <div class="phase-wrapper">
      <p class="current">Current Phase</p>
      <p class="title">{{ label }}</p>
      <div v-if="btnVisibility" class="buttons">
        <button
          @click="submitDone"
          :disabled="playerReady"
          type="button"
          name="Phase Done Button"
          class="donebtn tour-donebtn pulse infinite"
          :class="{ animated: !playerReady }"
        >
          Done
        </button>
        <font-awesome-icon
          class="cancelbtn"
          @click="submitCancel"
          v-if="playerReady"
          :icon="['far', 'times-circle']"
          size="sm"
        />
      </div>
      <div class="round-info-modal">
        <p>Phase {{phaseNumbers}} of 5</p>
      </div>
    </div>
    <p class="transition" :class="{'blink-timer': this.$store.state.timeRemaining < 60,'time':this.$store.state.timeRemaining >= 60}">{{ timeRemaining }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Inject, InjectReactive, Vue } from 'vue-property-decorator';
import Round from '@port-of-mars/client/components/gamedashboard/top/Round.vue';
import { PHASE_LABELS } from '@port-of-mars/shared/types';
import ModalConfirmation from '@port-of-mars/client/components/newGameDashboard/global/modals/ModalConfirmation.vue';
import * as s from '@port-of-mars/shared/types';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
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
  @Inject() private api!: GameRequestAPI;

  get label() {
    // const lbl = PHASE_LABELS[this.$tstore.state.phase];
    this.$root.$emit('closeModal');

    if (this.$store.state.phase === s.Phase.events) {

      return `Event ${this.$tstore.state.marsEventsProcessed + 1}`;
    }

    return PHASE_LABELS[this.$tstore.state.phase];
  }

  get phase() {
    return this.$tstore.state.phase;
  }

  get phaseNumbers(){
    return this.$store.state.phase;
  }

  get btnVisibility() {
    // if(this.phase == s.Phase.events){
    //   return false;
    // }

    return true;
  }

  get playerReady() {
    return this.$store.getters.player.ready;
  }

  private submitDone() {
    switch (this.phase) {
      case s.Phase.events:
        if(this.$tstore.getters.currentEvent != undefined &&
          this.$tstore.getters.currentEvent.id == 'breakdownOfTrust'
          ){
          this.api.saveResourcesSelection(
            this.$tstore.getters.player.pendingInvestments
          );
        }
      case s.Phase.invest:
        this.api.investTimeBlocks(
          this.$tstore.getters.player.pendingInvestments
        );
      default:
        this.api.setPlayerReadiness(true);
    }
  }

  private submitCancel() {
    switch (this.phase) {
      case s.Phase.invest:

      default:
        this.api.setPlayerReadiness(false);
    }
  }

  get timeRemaining() {
    const tr = this.$store.state.timeRemaining;
    const minutesRemaining = Math.floor(tr / 60);
    const minutesRemainingDisplay = `${minutesRemaining}`.padStart(2, '0');
    const secondsRemainingDisplay = `${tr - minutesRemaining * 60}`.padStart(
      2,
      '0'
    );
    return `${minutesRemainingDisplay}:${secondsRemainingDisplay}`;
  }
}
</script>

<style lang="scss" scoped>
@import '~animate.css/source/attention_seekers/pulse.css';
@import '@port-of-mars/client/stylesheets/gamedashboard/top/Phase.scss';
</style>
