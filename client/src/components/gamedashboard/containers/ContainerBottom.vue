<template>
  <BContainer class="container-bottom">
    <BRow class="row-bottom">
      <BCol class="container-bottom" cols="12">
        <InvestmentsPane v-if="gamePhase == phase.invest"/>
        <ContainerEvents v-if="gamePhase == phase.events"/>
        <ContainerDefault v-else/>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import ContainerEvents from '@/components/gamedashboard/containers/ContainerEvents.vue';
import InvestmentsPane from '@/components/gamedashboard/containers/GameboardPanes/InvestmentsPane.vue';
import ContainerDefault from '@/components/gamedashboard/containers/ContainerDefaultView.vue';

import { Phase } from "shared/types";

@Component({
  components: {
    BContainer,
    BRow,
    BCol,

    ContainerEvents,
    InvestmentsPane,
    ContainerDefault,
  }
})
export default class ContainerBottom extends Vue {
  private currentView: string = 'default';

  get phase(){
    return Phase;
  }

  get gamePhase(){
    return this.$store.state.gamePhase;
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

.container-bottom{
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
