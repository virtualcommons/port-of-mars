<template>
  <div class="c-trades container tour-trade-list">
    <div class="wrapper row">
      <div class="trade-list col-12">
        <div class="topbar">
          <div class="title-wrapper">
            <div class="wrapper">
              <p class="title">Active Trades</p>
              <b-form-checkbox
                v-model="checked"
                switch
                class="tour-trade-filters"
              >
                <span v-if="checked">Your Trades</span>
                <span v-else>All Trades</span>
              </b-form-checkbox>
            </div>
          </div>
          <button @click="requestTrade" class="tour-request-trade"
                  :disabled="playerReady"
          >
            Request a Trade
          </button>
        </div>
        <div class="outer-wrapper tour-active-trades-list">
          <div class="wrapper">
            <ActiveTrade
              :key="trade.id"
              :participant="associatedWithTrade(trade)"
              v-bind="trade"
              v-for="trade in trades"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Inject, Vue} from "vue-property-decorator";
  import ActiveTrade from "./trade/ActiveTrade.vue";
  import {TutorialAPI} from '@port-of-mars/client/api/tutorial/request';

  @Component({
    components: {
      ActiveTrade
    }
  })
  export default class Trades extends Vue {
    @Inject()
    readonly api!: TutorialAPI;

    private checked: boolean = false;

    /**
     * If player is ready, disabled is true.
     */
    get disabled() {
      return this.playerReady;
    }

    /**
     * Check if player is ready.
     */
    get playerReady() {
      return this.$tstore.getters.player.ready;
    }

    /**
     * Trades
     */
    get trades() {
      const tradeSet = this.$tstore.state.tradeSet;

      // map the trades to something we can use
      const trades = Object.keys(tradeSet).map(id => ({
        id,
        sender: tradeSet[id].sender,
        recipient: tradeSet[id].recipient,
        status: tradeSet[id].status
      }));

      return trades
        // filter the trades by active filter (show all trades vs local player's trades)
        .filter((trade) => {
          return !this.checked || this.associatedWithTrade(trade) != -1;
        })

        // sort the trades by association
        // trades sent to local player will be at the top, followed by trades that local player has sent
        .sort((a, b) => {
          return this.associatedWithTrade(b) - this.associatedWithTrade(a);
        });
    }

    /**
     * The role of the local player.
     */
    get myRole() {
      return this.$tstore.getters.player.role;
    }

    /**
     * Determine local player's relation to each trade (sender, recipient, N/A).
     * @param trade A trade.
     *
     * 1 : local player is recipient of trade
     * 0 : local player is sender of trade
     * -1: local player is not involved in trade
     */
    private associatedWithTrade(trade: any): number {
      return trade.recipient.role == this.myRole ? 1 : trade.sender.role == this.myRole ? 0 : -1;
    }

    /**
     * Open trade request modal when player wants to initiate a trade.
     */
    private requestTrade() {
      this.api.setModalVisible({type: 'TradeRequestModal', data: {}});

      if (this.$tstore.state.round < 3) this.makeToast();
    }

    private makeToast() {
      this.$bvToast.toast('To initiate a trade request, select a trade partner first. Then make your offer and request.', {
        title: 'Remember!',
        toaster: 'b-toaster-top-left',
        variant: 'warning',
        solid: true,
        autoHideDelay: 10000,
      });
    }

  }

</script>

<style lang="scss" scoped>
  @import "@port-of-mars/client/stylesheets/game/phases/Trades.scss";
</style>
