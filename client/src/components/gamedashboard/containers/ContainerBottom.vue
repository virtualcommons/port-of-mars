<template>
  <BContainer class="container-bottom">
    <BRow class="row-bottom">
      <BCol class="container-bottom-investments" cols="7" v-if="currentView === 'Default'">
        <ContainerInvestments />
      </BCol>
      <BCol class="container-bottom-accomplishments" cols="5" v-if="currentView === 'Default'">
        <ContainerAccomplishments />
      </BCol>
      <BCol class="container-bottom-events v-step-4" cols="12" v-if="currentView === 'Events'">
        <ContainerEvents />
      </BCol>
      <BCol class="container-bottom-trade" cols="12" v-if="currentView === 'Trade'">
        <ContainerTrade />
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
import { PHASE_LABELS } from 'shared/types';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    ContainerInvestments,
    ContainerAccomplishments,
    ContainerEvents,
    ContainerTrade
  }
})
export default class ContainerBottom extends Vue {
  // private currentView: string = 'default';

  get currentView() {
    switch (PHASE_LABELS[this.$store.state.phase]) {
      case 'Events':
        return 'Events';
        break;
      case 'Trade':
        return 'Trade';
        break;
      default:
        return 'Default';
        break;
    }
  }

  mounted() {
    this.$root.$on('openEvent', (data: string) => {
      this.currentView = 'event';
    });
    this.$root.$on('closeEvent', (data: string) => {
      this.currentView = 'default';
    });
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

.container-bottom-investments,
.container-bottom-accomplishments,
.container-bottom-events,
.container-bottom-trade {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
