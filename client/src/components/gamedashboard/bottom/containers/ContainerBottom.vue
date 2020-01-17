<template>
  <div class="container-bottom v-step-4">
    <div class="b-row">
      <div class="view">
        <ContainerInvestments v-if="gamePhase == phase.invest" />
        <!-- SCSS REVISIT -->
        <ContainerEvents v-else-if="gamePhase == phase.events" />
        <ContainerTrade v-else-if="gamePhase == phase.trade" />
        <ContainerPurchase v-else-if="gamePhase == phase.purchase" />
        <ContainerDiscard v-else-if="gamePhase == phase.discard" />
        <ContainerDefault v-else />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ContainerEvents from '@/components/gamedashboard/bottom/containers/ContainerEvents.vue';
import ContainerInvestments from '@/components/gamedashboard/bottom/containers/ContainerInvestments.vue';
import ContainerDefault from '@/components/gamedashboard/bottom/containers/ContainerDefault.vue';
import ContainerTrade from '@/components/gamedashboard/bottom/containers/ContainerTrade.vue';
import ContainerPurchase from '@/components/gamedashboard/bottom/containers/ContainerPurchase.vue';
import ContainerDiscard from '@/components/gamedashboard/bottom/containers/ContainerDiscard.vue';
import { Phase } from 'shared/types';

@Component({
  components: {
    ContainerEvents,
    ContainerTrade,
    ContainerDefault,
    ContainerInvestments,
    ContainerPurchase,
    ContainerDiscard
  }
})
export default class ContainerBottom extends Vue {
  get phase() {
    return Phase;
  }

  get gamePhase() {
    return this.$store.state.phase;
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/containers/ContainerBottom.scss';
</style>
