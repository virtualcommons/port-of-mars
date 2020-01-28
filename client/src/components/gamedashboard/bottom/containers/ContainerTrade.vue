<template>
    <div class="trade-container tour-trade">
        <div class="trade-request">
            <div class="section-text">
                <p>Request Trade</p>
            </div>
            <TradeRequest/>
        </div>

        <div class="trade-list">
            <div class="section-text">
                <p>Active Trade List</p>
            </div>
            <div class="trades-wrapper">
              <Trade v-for="trade in trades" v-bind="trade" :key="Math.random()" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Trade from '@/components/gamedashboard/bottom/trading/Trade.vue';
import TradeRequest from '@/components/gamedashboard/bottom/trading/TradeRequest.vue';

@Component({
  components: {
    Trade,
    TradeRequest
  }
})
export default class ContainerTrade extends Vue {

  get trades() {
    const tradeSet = this.$tstore.state.tradeSet;
    return Object.keys(tradeSet).map(id => ({
      id,
      from: tradeSet[id].from,
      to: tradeSet[id].to
    }));
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/containers/ContainerTrade.scss';
</style>
