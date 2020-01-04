<template>
  <div class="container-bottom">
    <div class="b-row">
      <div class="view">
        <InvestmentsPane v-if="gamePhase == phase.invest" />
        <!-- SCSS REVISIT -->
        <ContainerEvents v-else-if="gamePhase == phase.events" />
        <ContainerTrade v-else-if="gamePhase == phase.trade" />
        <ContainerDefaultView v-else />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ContainerInvestments from '@/components/gamedashboard/containers/ContainerInvestments.vue';
import ContainerAccomplishments from '@/components/gamedashboard/containers/ContainerAccomplishments.vue';
import ContainerEvents from '@/components/gamedashboard/containers/ContainerEvents.vue';
import InvestmentsPane from '@/components/gamedashboard/containers/GameboardPanes/InvestmentsPane.vue';
import ContainerDefaultView from '@/components/gamedashboard/containers/ContainerDefaultView.vue';
import ContainerTrade from '@/components/gamedashboard/containers/ContainerTrade.vue';
import { Phase } from 'shared/types';

@Component({
  components: {
    ContainerInvestments,
    ContainerAccomplishments,
    ContainerEvents,
    ContainerTrade,
    ContainerDefaultView,
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
@import '@/stylesheets/gamedashboard/containers/ContainerBottom.scss';
</style>
