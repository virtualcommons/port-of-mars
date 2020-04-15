<template>
  <div class="trade-container container">
    <div class="wrapper row">
      <div class="trade-list tour-trade-list col-12">
        <div class="content container">
          <div class="header row">
            <div class="title col-10">
              <p>Active Trade List</p>
            </div>
            <div class="requesttradebutton col-2 tour-request-trade">
              <button @click="handleOpenTradeRequest()">
                Request a Trade
              </button>
            </div>
          </div>
          <div class="trades row">
            <div class="wrapper">
              <ActiveTrade v-for="trade in trades" v-bind="trade" :key="trade.id" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import ActiveTrade from "./trade/ActiveTrade.vue";
import { TutorialAPI } from '@port-of-mars/client/api/tutorial/request';

@Component({
  components: {
    ActiveTrade
  }
})
export default class Trades extends Vue {
  @Inject()
  readonly api!: TutorialAPI;

  get trades() {
    const tradeSet = this.$tstore.state.tradeSet;
    const trades = Object.keys(tradeSet).map(id => ({
      id,
      from: tradeSet[id].from,
      to: tradeSet[id].to
    }));
    return trades;
  }

  get isInTutorial() {
    return this.$tstore.getters.layout === "tutorial";
  }

  tutorialValidation() {
    if (this.isInTutorial) {
      this.api.completedGeneralClick();
    }
  }

  private handleOpenTradeRequest() {
    this.$tstore.commit("SET_TRADE_REQUEST_MODAL_VISIBILITY", true);
    
    this.tutorialValidation();
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/phases/Trades.scss";
</style>
