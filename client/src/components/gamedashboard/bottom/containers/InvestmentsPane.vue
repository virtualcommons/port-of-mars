<template>
  <div class="investments-pane">
    <div class="investments">
      <ContainerInvestments />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ContainerInvestments from '@/components/gamedashboard/bottom/containers/ContainerInvestments.vue';

@Component({
  components: {
    ContainerInvestments
  }
})
export default class ContainerBottom extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/containers/InvestmentsPane.scss';
</style>
