<template>
  <div class="c-trades container tour-trade-list">
    <div class="wrapper row">
      <div class="trade-list col-12">
        <div class="topbar">
          <div class="title-wrapper">
            <div class="wrapper">
              <p class="title">Active Trades</p>
              <div class="filter-options">
                <input type="checkbox" id="yourTrades" :value="0" @change="checked(0)" v-model="activeFilters" >
                <label class="filter-option" for="yourTrades">Your Trades</label>
                <input type="checkbox" id="requestedTrades" :value="1" @change="checked(1)" v-model="activeFilters">
                <label class="filter-option" for="requestedTrades">Trades Sent to You</label>
                <input type="checkbox" id="allTrades" :value="-1" @change="checked(-1)" v-model="activeFilters">
                <label class="filter-option" for="allTrades">All Active Trades</label>
              </div>
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
              :participant="associatedWithTrade(trade)"
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

  //the array of active filters
  //1-> show trades I've received
  //0-> show trades I've sent
  //-1-> show all trades

  //NOTE: 1 and 0 can be active at the same time, but -1 cannot.
  private activeFilters:Array<number> = [-1];

  get trades() {
    const tradeSet = this.$tstore.state.tradeSet;
    //map the trades to something we can use
    const trades = Object.keys(tradeSet).map(id => ({
      id,
      from: tradeSet[id].from,
      to: tradeSet[id].to,
      status: tradeSet[id].status
    }));

    return trades
    .filter((trade) => {/* Filter the trades by active filters. if -1 is in the list, we want to show all trades. */
      return this.activeFilters.indexOf(-1) != -1 || this.activeFilters.indexOf(this.associatedWithTrade(trade)) != -1;
    })
    .sort((a,b) => {/* Sort the trades by association trades sent to you will be at the top, followed by trades you've sent. */
      return this.associatedWithTrade(b) - this.associatedWithTrade(a);
    });
  }

  get myRole(){
    return this.$tstore.getters.player.role;
  }

  //this checks each trade to determine a player's relation to it.
  //1 if the player is reciving the trade,
  //0 if the player sent the trade
  //-1 if the player has no interaction with trade
  associatedWithTrade(trade:any){
    return trade.to.role == this.myRole ? 1 : trade.from.role == this.myRole ? 0 : -1;
  }

  //this is some extra validation on the checkboxes.
  /*we don't want to be able to select 'show all trades'
  and either 'your trades' or 'trades sent by you' at the same time.
  */
  //if there are no options selected, we default to all trades.
  async checked(value:number){
    //finding if no filter is active
    const noFilter = this.activeFilters.indexOf(-1);
    
    //if 'show all trades' is active and the input value is not -1, we want to remove
    //'show all trades' from the list of active filters.
    if(noFilter != -1 && value != -1){
      this.activeFilters.splice(noFilter, 1);
      return;
    }

    //if 'show all trades' was selected OR no options are selected,
    //turn on 'show all trades'
    if(value == -1 || this.activeFilters.length < 1){
      await this.$nextTick();
      this.activeFilters = [-1];
      return;
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
