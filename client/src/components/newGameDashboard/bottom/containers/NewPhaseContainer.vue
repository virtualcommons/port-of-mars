<template>
  <div class="c-phasecontainer row">
    <div class="content">
      <!-- THIS IS WHERE WE SWAP BOARD BASED ON PHASE -->

      <!-- <ContainerTrade /> -->
      <!-- <ContainerPurchase /> -->
      <!-- <ContainerDiscard/> -->
      <!-- <ContainerEvents /> -->
      
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
import ContainerInvestments from './ContainerInvestments.vue'
import ContainerTrade from './ContainerTradeRework.vue';
import ContainerPurchase from './ContainerPurchaseRework.vue';
import ContainerDiscard from './ContainerDiscardRework.vue';
import ContainerEvents from './ContainerEventsRework.vue';
import ContainerDefault from './/ContainerDefault.vue';

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
export default class NewPhaseContainer extends Vue {
  get phase() {
    return Phase;
  }

  get gamePhase() {
    return this.$store.state.phase;
  }

}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/bottom/containers/NewPhaseContainer.scss';
</style>
