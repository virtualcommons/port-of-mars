<template>
  <div class="c-trades container">
    <div class="wrapper row">
      <div class="trade-list col-12">
        <div class="topbar">
          <div class="title-wrapper">
            <div class="wrapper">
              <p class="title">Active Trades</p>
            </div>
          </div>
          <button @click="handleOpenTradeRequest" class="tour-request-trade">
            Request a Trade
          </button>
        </div>
        <div class="outer-wrapper tour-trade-list">
          <div class="wrapper">
            <ActiveTrade
              v-for="trade in trades"
              v-bind="trade"
              :key="trade.id"
            />
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
    this.$tstore.commit('SET_MODAL_VISIBLE', {
      type: 'TradeRequestModal',
      data: {},
    });

    this.tutorialValidation();
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/phases/Trades.scss";
</style>
