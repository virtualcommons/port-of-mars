<template>
  <div class="trade-container tour-trade container">
    <div class="wrapper row">
      <div class="trade-list tour-trade-item col-12">
        <div class="content container">
          <div class="header row">
            <div class="title col-10">
              <p>Active Trade List</p>
            </div>
            <div class="requesttradebutton col-2">
              <button @click="handleOpenTradeRequest()">
                Request a Trade
              </button>
            </div>
          </div>
          <div class="trades row">
            <div class="wrapper">
              <Trade v-for="trade in trades" v-bind="trade" :key="trade.id" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Trade from '@port-of-mars/client/components/newGameDashboard/bottom/trading/Trade.vue';
import Chat from '@port-of-mars/client/components/newGameDashboard/right/ChatRework.vue';
@Component({
  components: {
    Trade,
    Chat
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

  handleOpenTradeRequest() {
    this.$tstore.commit('SET_TRADE_REQUEST_MODAL_VISIBILITY', true);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/bottom/containers/ContainerTradeRework.scss';
</style>
