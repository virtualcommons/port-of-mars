<template>
  <div class="c-trades container tour-trade-list">
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
        <div class="outer-wrapper tour-active-trades-list">
          <div class="wrapper">
            <ActiveTrade
              v-for="trade in trades"
              v-bind="trade"
              :key="trade.id"
              :involved="amInvolved(trade)"
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
      to: tradeSet[id].to,
      status: tradeSet[id].status
    }));
    return trades.sort((a,b) => {
      return this.amInvolved(a)-this.amInvolved(b);
    });
  }

  get myRole(){
    return this.$tstore.getters.player.role;
  }

  amInvolved(trade:any){
    console.log(trade.to, this.myRole);
    if(trade.to.role == this.myRole){
      return 1;
    }
    else if (trade.from.role == this.myRole){
      return 0;
    }
    else{
      return -1;
    }
  }


  private handleOpenTradeRequest() {
    this.api.setModalVisible({type: 'TradeRequestModal',data: {}});
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/phases/Trades.scss";
</style>
