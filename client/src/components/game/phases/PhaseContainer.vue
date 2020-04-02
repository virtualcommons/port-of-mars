<template>
  <div class="c-phasecontainer row">
    <div class="content">
      <ContainerEvents v-if="gamePhase == phase.events"  />
      <ContainerInvestments v-if="gamePhase == phase.invest" />
      <ContainerTrade v-else-if="gamePhase == phase.trade" />
      <ContainerPurchase v-else-if="gamePhase == phase.purchase" />
      <ContainerDiscard v-else-if="gamePhase == phase.discard" />
      <ContainerDefault v-else />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ContainerInvestments from './investmentPhase/ContainerInvestments.vue'
import ContainerTrade from './tradePhase/ContainerTrade.vue';
import ContainerPurchase from './purchasePhase/ContainerPurchase.vue';
import ContainerDiscard from './discardPhase/ContainerDiscard.vue';
import ContainerEvents from './eventsPhase/ContainerEvents.vue';
import ContainerDefault from './default/ContainerDefault.vue';

import { Phase } from '@port-of-mars/shared/types';
@Component({
  components: {
    ContainerTrade,
    ContainerPurchase,
    ContainerDiscard,
    ContainerEvents,
    ContainerInvestments,
    ContainerDefault,
  }
})
export default class PhaseContainer extends Vue {
  get phase() {
    return Phase;
  }

  get gamePhase() {
    return this.$store.state.phase;
  }

}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/PhaseContainer.scss';
</style>
