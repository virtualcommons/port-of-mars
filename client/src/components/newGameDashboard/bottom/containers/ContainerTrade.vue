<template>
  <div class="trade-container tour-trade">
    <div class="trade-request tour-trade-request">
      <div class="section-text">
        <p>Request Trade</p>
      </div>
      <div class="wrapper">
        <TradeRequest />
      </div>
    </div>

    <div class="trade-list tour-trade-item">
      <div class="section-text">
        <p>Active Trade List</p>
      </div>
      <div class="trades-wrapper">
        <Trade v-for="trade in trades" v-bind="trade" :key="trade.id" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Trade from '@port-of-mars/client/components/gamedashboard/bottom/trading/Trade.vue';
import TradeRequest from '@port-of-mars/client/components/gamedashboard/bottom/trading/TradeRequest.vue';

@Component({
  components: {
    Trade,
    TradeRequest
  }
})
export default class ContainerTrade extends Vue {
  get trades() {
    const tradeSet = this.$tstore.state.tradeSet;
    const trades = Object.keys(tradeSet).map(id => ({
      id,
      from: tradeSet[id].from,
      to: tradeSet[id].to
    }));
    console.log(trades);
    return trades;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/bottom/containers/ContainerTrade.scss';
</style>
