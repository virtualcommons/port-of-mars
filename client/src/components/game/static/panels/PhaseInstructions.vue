<template>
  <div class="c-phaseinstructions">
    <div class="wrapper">
      <p class="title">Phase Instructions</p>
      <div class="instructions">
        <div class="text">
          <p>{{ phaseInstructions }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Phase, PHASE_LABELS } from '@port-of-mars/shared/types';
import { PHASE_INSTRUCTIONS } from '@port-of-mars/client/repo/instructions.ts';

@Component({
  components: {},
})
export default class PhaseInstructions extends Vue {
  get phaseNumber() {
    const phaseNumber = this.$store.state.phase;
    return phaseNumber ? phaseNumber : 0;
  }

  get phaseInstructions() {
    switch (this.phaseNumber) {
      case Phase.events:
        return PHASE_INSTRUCTIONS.events;
      case Phase.invest:
        return PHASE_INSTRUCTIONS.invest;
      case Phase.trade:
        return PHASE_INSTRUCTIONS.trade;
      case Phase.purchase:
        return PHASE_INSTRUCTIONS.purchase;
      case Phase.discard:
        return PHASE_INSTRUCTIONS.discard;
      default:
        return 'No instructions for this phase.';
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/static/panels/PhaseInstructions.scss';
</style>
