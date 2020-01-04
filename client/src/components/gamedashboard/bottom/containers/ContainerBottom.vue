<template>
  <div class="container-bottom">
    <div class="b-row">
      <div class="view">
        <InvestmentsPane v-if="gamePhase == phase.invest" />
        <!-- SCSS REVISIT -->
        <ContainerEvents v-else-if="gamePhase == phase.events" />
        <ContainerTrade v-else-if="gamePhase == phase.trade" />
        <ContainerDefault v-else />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ContainerInvestments from '@/components/gamedashboard/bottom/containers/ContainerInvestments.vue';
import ContainerEvents from '@/components/gamedashboard/bottom/containers/ContainerEvents.vue';
import InvestmentsPane from '@/components/gamedashboard/bottom/containers/InvestmentsPane.vue';
import ContainerDefault from '@/components/gamedashboard/bottom/containers/ContainerDefault.vue';
import ContainerTrade from '@/components/gamedashboard/bottom/containers/ContainerTrade.vue';
import { Phase } from 'shared/types';

@Component({
  components: {
    ContainerInvestments,
    ContainerEvents,
    ContainerTrade,
    ContainerDefault,
    InvestmentsPane
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
