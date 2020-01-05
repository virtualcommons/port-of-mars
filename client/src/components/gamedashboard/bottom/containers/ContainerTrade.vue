<template>
  <div class="container-trade">
    <div class="trade-row">
      <div class="column-3 trade-options">
        <button
          type="button"
          name="button"
          @click="handleClick('incoming')"
          :class="currentView === 'incoming' ? 'btn-active' : ''"
        >
          Incoming Trades
        </button>
        <button
          type="button"
          name="button"
          @click="handleClick('request')"
          :class="currentView === 'request' ? 'btn-active' : ''"
        >
          Your Trades
        </button>
      </div>
      <div class="trade-incoming" v-if="currentView === 'incoming'">
        <div class="trade-incoming-list-wrapper">
          <div class="trade-incoming-list">
            <!-- need to refactor key -->
            <Trade v-for="trade in trades" v-bind="trade" :key="Math.random()" />
          </div>
        </div>
      </div>
      <div class="trade-request" v-if="currentView === 'request'">
        <div class="trade-request-list-wrapper">
          <div class="trade-request-list">
            <!-- need to refactor key -->
            <Trade v-for="trade in trades" v-bind="trade" :key="Math.random()" />
          </div>
        </div>
        <div class="trade-request-make">
          <TradeRequest />
        </div>
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
  private currentView: string = 'incoming';

  get trades() {
    const tradeSet = this.$tstore.state.tradeSet;
    return Object.keys(tradeSet).map(id => ({
      id,
      from: tradeSet[id].from,
      to: tradeSet[id].to
    }));
  }

  private handleClick(view: string) {
    this.currentView = view;
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/containers/ContainerTrade.scss';
</style>
