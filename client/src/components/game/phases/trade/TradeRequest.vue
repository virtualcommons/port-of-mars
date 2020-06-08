<template>
  <div class="c-trade-request container tour-trade-request">
    <div class="player-selection-wrapper row tour-request-trade-partner">
      <div class="player col-3" v-for="player in otherPlayers" :key="player">
        <button
          @click="handleChange(player)"
          class="outer-frame"
          :style="borderStyle(player)"
        >
          <div class="inner-frame" :style="frameStyle(player)">
            <img
              :src="
                require(`@port-of-mars/client/assets/characters/${player}.png`)
              "
              alt="Player"
            />
          </div>
        </button>
        <p>{{ player }}</p>
      </div>
    </div>
    <div class="request-wrapper row">
      <div class="request col-12">
        <TradeOptions
          :resourceReader="handleReceiveResources"
          :resources="exchangeResources"
          :mode="'incoming'"
          :text="'Your Request'"
          class="tour-request-resources"
        />
      </div>
    </div>
    <div class="offer-wrapper row">
      <div class="offer col-12">
        <TradeOptions
          :resourceReader="handleSendResources"
          :resources="sentResources"
          :mode="'outgoing'"
          :text="'Your Offer'"
          class="tour-offer-resources"
        />
      </div>
    </div>
    <div class="buttons-wrapper row">
      <div class="buttons col-12">
        <button
          @click="handleTrade"
          :disabled="!clientValidation"
          class="tour-send-trade"
        >
          Send Trade
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import TradeOptions from '@port-of-mars/client/components/game/phases/trade/TradeOptions.vue';
import {
  TradeData,
  TradeAmountData,
  ResourceAmountData,
  Role,
} from '@port-of-mars/shared/types';
import { canPlayerMakeTrade } from '@port-of-mars/shared/validation';
import { makeTradeSafe } from '@port-of-mars/shared/validation';
import {SendTradeRequestData} from "@port-of-mars/shared/game";
import {AbstractGameAPI} from "@port-of-mars/client/api/game/types";

@Component({
  components: {
    TradeOptions,
  },
})
export default class TradeRequest extends Vue {
  @Inject() readonly api!: AbstractGameAPI;
  private count: number = 0;

  created() {
    this.api.setTradePlayerName(this.$tstore.getters.player.role);
  }

  destroyed() {
    this.api.resetTradeModal();
  }

  // NOTE :: STATE GETTERS

  get tradePartnerName() {
    return this.$tstore.state.ui.tradeData.recipient.role;
  }

  get sentResources() {
    return this.$tstore.state.ui.tradeData.recipient.resourceAmount;
  }

  get exchangeResources() {
    return this.$tstore.state.ui.tradeData.sender.resourceAmount;
  }

  get otherPlayers() {
    return Object.keys(this.$tstore.getters.otherPlayers);
  }

  // NOTE :: HANDLE TRADE

  private handleChange(name: string) {
    if (name == this.tradePartnerName) {
      this.api.setTradePartnerName('');
    } else {
      this.api.setTradePartnerName(name);
    }
  }

  get clientValidation() {
    const inventory = this.$tstore.getters.player.inventory;
    return (
      this.tradePartnerName != '' &&
      canPlayerMakeTrade(this.sentResources, inventory)
    );
  }

  private handleSendResources(resources: ResourceAmountData) {
    this.api.setTradeGiveResources(resources);
  }

  private handleReceiveResources(resources: ResourceAmountData) {
    this.api.setTradeGetResources(resources);
  }

  private handleTrade() {
    if (this.clientValidation) {
      const fromPackage: TradeAmountData = {
        role: this.$tstore.state.role,
        resourceAmount: makeTradeSafe(this.sentResources),
      };
      const toPackage: TradeAmountData = {
        role: this.tradePartnerName as Role,
        resourceAmount: makeTradeSafe(this.exchangeResources),
      };
      const tradeDataPackage: SendTradeRequestData['trade'] = {
        sender: fromPackage,
        recipient: toPackage,
        status: 'Active',
      };
      this.api.sendTradeRequest(tradeDataPackage);
      this.api.setModalHidden();
    }
  }


  // NOTE :: STYLES
  private borderStyle(role: Role) {
    return role === this.tradePartnerName
      ? { border: `0.125rem solid var(--new-space-orange)` }
      : { border: `0.125rem solid var(--color-${role})` };
  }

  private frameStyle(role: Role) {
    return role === this.tradePartnerName
      ? { backgroundColor: `var(--new-space-orange)` }
      : { backgroundColor: `var(--color-${role})` };
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/trade/TradeRequest.scss';
</style>
