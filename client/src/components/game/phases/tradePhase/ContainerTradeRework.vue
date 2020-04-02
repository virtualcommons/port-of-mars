<template>
  <div class="trade-container tour-trade">
    <div class="trade-list tour-trade-item">
      <div class=header>
        <div class="section-text">
          <p>Active Trade List</p>
        </div>
        <button class="request-trade-button" @click="handleOpenTradeRequest()">Request a trade </button>
      </div>

      <div class="trades-wrapper">

        <Trade v-for="trade in trades" v-bind="trade" :key="trade.id" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Trade from './Trade.vue';
@Component({
  components: {
    Trade,
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

  handleOpenTradeRequest(){
    this.$tstore.commit('SET_TRADE_REQUEST_MODAL_VISIBILITY', true);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/tradePhase/ContainerTradeRework.scss';
</style>
