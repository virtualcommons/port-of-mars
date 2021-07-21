<template>
  <b-row class="h-100 w-100 flex-column m-0 p-0 tour-active-trades-list">
    <!-- header -->
    <b-row class="h-auto w-100 p-0 m-0 justify-content-between">
      <b-col cols="9" class="h-100 w-100 p-3 m-0 d-flex flex-row justify-content-between align-items-center"
             style="background-color: var(--main-brand); color: var(--dark-shade);">
        <p class="my-auto">Active Trades</p>
        <b-form-checkbox
          v-model="checked"
          switch
          class="tour-trade-filters"
        >
          <span v-if="checked">Your Trades</span>
          <span v-else>All Trades</span>
        </b-form-checkbox>
      </b-col>
      <b-col cols="3" class="h-100 w-100 p-0">
        <button @click="requestTrade" class="h-100 w-100 mr-5 ml-1 tour-request-trade"
                :disabled="playerReady"
        >
          Request a Trade
        </button>
      </b-col>
    </b-row>
    <!-- trade list -->
    <b-row class="flex-grow-1 w-100 flex-column justify-content-start align-items-center
           p-0 mx-0 mt-2 mb-0 overflow-hidden" style="background-color: var(--light-shade-05)">
      <div class="position-absolute mt-2" style="overflow-y: auto; overflow-x: hidden;
           height: 48%; width: 95%;"
      >
        <ActiveTrade
          :key="trade.id"
          :participant="associatedWithTrade(trade)"
          v-bind="trade"
          v-for="trade in trades"
        />
      </div>
    </b-row>
  </b-row>
</template>

<script lang="ts">
  import {Component, Inject, Vue} from "vue-property-decorator";
  import ActiveTrade from "./trade/ActiveTrade.vue";
  import {TutorialAPI} from '@port-of-mars/client/api/tutorial/request';
  import {Phase} from "@port-of-mars/shared/types";

  @Component({
    components: {
      ActiveTrade
    }
  })
  export default class Trades extends Vue {
    @Inject()
    readonly api!: TutorialAPI;

    private checked: boolean = this.$tstore.getters.toggleYourTrades;

    get phase() {
      return this.$tstore.state.phase;
    }

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
        sender: tradeSet.get(id)!.sender,
        recipient: tradeSet.get(id)!.recipient,
        status: tradeSet.get(id)!.status
      }));

      return trades
        // filter the trades by active filter (show all trades vs local player's trades)
        .filter((trade) => {
          // this.$tstore.commit('SET_TRADE_FILTER', !this.checked);
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

    created() {
      if (this.phase === Phase.trade) {
        this.api.setHUDLeftView(2);
      }
    }

    updated() {
      this.$tstore.commit('SET_TOGGLE_YOUR_TRADES', this.checked);
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
button {
  @include reset-button;
  @include default-transition-base;
  padding: 0.5rem 1rem;
  font-size: $font-med;
  font-weight: $bold !important;
  text-align: center;
  border: solid 0.125rem $dark-accent;
  color: $dark-accent;

  &:hover {
    color: $modal-foreground-default;
    background-color: $dark-accent;
  }

  &:disabled {
    border: solid 0.125rem $light-shade-25;
    color: $light-shade-25;
    background-color: $dark-shade;
    cursor: not-allowed;
    opacity: 90%;
  }
}
</style>
