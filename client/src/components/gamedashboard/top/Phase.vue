<template>
  <div class="phase-component">
    <Round />
    <div class="phase-wrapper">
      <p class="current">Current Phase</p>
      <p class="title">{{ label }}</p>
      <div v-if="btnVisibility" class="buttons">
        <button
          class="donebtn tour-donebtn"
          @click="submitDone"
          :disabled="playerReady"
          type="button"
          name="Phase Done Button"
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
    if(this.phase == s.Phase.events){
      return false;
    }

    return true;
  }

  get playerReady() {
    return this.$store.getters.player.ready;
  }

  private submitDone() {
    switch (this.phase) {
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
@import '@/stylesheets/gamedashboard/top/Phase.scss';
</style>
