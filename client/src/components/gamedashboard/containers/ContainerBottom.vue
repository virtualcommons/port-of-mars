<template>
  <BContainer class="container-bottom">
    <BRow class="row-bottom">
      <BCol class="container-bottom container-bottom-view" cols="12" v-if="[phase.invest, phase.discard].includes(gamePhase)">
        <InvestmentsPane />
      </BCol>
      <BCol class="container-bottom container-bottom-view" cols="12" v-else-if="gamePhase === phase.events">
        <ContainerEvents />
      </BCol>
      <BCol class="container-bottom container-bottom-view" cols="12" v-else-if="gamePhase === phase.trade">
        <ContainerTrade  />
      </BCol>
      <BCol class="container-bottom container-bottom-view" cols="12" v-else>
        <ContainerDefault/>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import ContainerInvestments from '@/components/gamedashboard/containers/ContainerInvestments.vue';
import ContainerAccomplishments from '@/components/gamedashboard/containers/ContainerAccomplishments.vue';
import ContainerEvents from '@/components/gamedashboard/containers/ContainerEvents.vue';
import ContainerTrade from '@/components/gamedashboard/containers/ContainerTrade.vue';
import InvestmentsPane from '@/components/gamedashboard/containers/GameboardPanes/InvestmentsPane.vue';
import ContainerDefault from '@/components/gamedashboard/containers/ContainerDefaultView.vue';

import { Phase } from "shared/types";

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    ContainerInvestments,
    ContainerAccomplishments,
    ContainerEvents,
    ContainerTrade,
    ContainerDefault,
    InvestmentsPane,
  }
})
export default class ContainerBottom extends Vue {
  get phase(){
    return Phase;
  }

  get gamePhase(){
    return this.$store.state.phase;
  }

}
</script>

<style scoped>
.container-bottom {
  height: 100%;
  width: 100%;
  max-width: none;
  padding: 0 1rem;
  margin: 0;
}

.row-bottom {
  height: 100%;
  width: 100%;
  padding: 0;
  border: 0.125rem solid var(--space-white-opaque-2);
  margin: 0;
}

.container-bottom-view {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
