<template>
  <BContainer class="container-bottom">
    <BRow class="row-bottom">
      <BCol class="container-bottom-investments" cols="7" v-if="currentView === 'default'">
        <ContainerInvestments />
      </BCol>
      <BCol class="container-bottom-accomplishments" cols="5" v-if="currentView === 'default'">
        <ContainerAccomplishments />
      </BCol>
      <BCol class="container-bottom-events v-step-4" cols="12" v-if="currentView === 'event'">
        <ContainerEvents />
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

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    ContainerInvestments,
    ContainerAccomplishments,
    ContainerEvents
  }
})
export default class ContainerBottom extends Vue {
  private currentView: string = 'default';

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
.container-bottom-events {
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
