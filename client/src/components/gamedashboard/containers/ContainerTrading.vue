<template>
  <div class="container-trading">
    <div class="row">
      <div class="column-6">
        <div class="row">
          <p>Incoming Trades</p>
        </div>
        <div class="row">
          <Trade />
          <Trade />
        </div>
      </div>

      <div class="column-6">
        <div class="row">
          <p>Build-a-trade workshop</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Trade from '../trading/Trade.vue';

@Component({
  components: {
    Trade
  }
})
export default class ContainerTrading extends Vue {}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/containers/ContainerTrading.scss';
</style>
