<template>
  <b-row class="h-100 w-100 mx-auto my-auto p-3">
    <p>{{ phaseInstructions }}</p>
  </b-row>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Phase } from "@port-of-mars/shared/types";
import { PHASE_INSTRUCTIONS } from "@port-of-mars/client/repo/instructions";

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
      case Phase.newRound:
        return PHASE_INSTRUCTIONS.newRound;
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
        return "No instructions for this phase.";
    }
  }
}
</script>
