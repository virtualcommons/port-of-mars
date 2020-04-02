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
import { phaseInstructions } from '@port-of-mars/client/repo/instructions.ts';

@Component({
  components: {}
})
export default class PhaseInstructions extends Vue {
  get phaseNumber() {
    const phaseNumber = this.$store.state.phase;
    return phaseNumber ? phaseNumber : 0;
  }

  get phaseInstructions() {
    switch (this.phaseNumber) {
      case Phase.events:
        return phaseInstructions.events;
        break;
      case Phase.invest:
        return phaseInstructions.invest;
        break;
      case Phase.trade:
        return phaseInstructions.trade;
        break;
      case Phase.purchase:
        return phaseInstructions.purchase;
        break;
      case Phase.discard:
        return phaseInstructions.discard;
        break;
      case Phase.victory:
        return phaseInstructions.victory;
        break;
      case Phase.defeat:
        return phaseInstructions.defeat;
        break;
      default:
        return 'No instructions for this phase.';
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/GameDashboardStatic/informationPanel/PhaseInstructions.scss';
</style>
