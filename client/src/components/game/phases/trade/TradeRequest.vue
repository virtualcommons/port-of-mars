<template>
  <b-container fluid no-gutters class="h-100">
    <b-form @submit.stop.prevent="createTrade">
      <!-- select trade partner -->
      <b-form-group class="w-100 p-2 tour-send-trade">
        <h4>Trade with:</h4>
        <b-form-radio
          v-for="player in otherPlayers"
          :key="player"
          :value="player"
          v-model="selected"
          @change="setTradeRecipient(selected)"
          inline
          class="mx-2"
          button
          button-variant="transparent"
          :style="{ border: borderStyle(player) }"
        >
          <b-img
            v-bind="mainProps"
            :src="$getAssetUrl(`characters/${player}.png`)"
            :alt="player"
            :style="{ backgroundColor: frameStyle(player) }"
          >
          </b-img>
          <p class="text-capitalize font-weight-bold mb-0 mt-2" style="color: var(--light-shade)">
            {{ player }}
          </p>
        </b-form-radio>
      </b-form-group>
      <div class="w-75 my-3 light-shade-05-border"></div>
      <!-- request -->
      <b-form-group>
        <h4>Ask For:</h4>
        <TradeOptions
          :resourceReader="handleReceiveResources"
          :resources="senderResources"
          :mode="'incoming'"
          :text="'Your Request'"
        ></TradeOptions>
      </b-form-group>

      <div class="w-75 my-3 light-shade-05-border"></div>

      <!-- offer -->
      <b-form-group>
        <h4>Your Offer:</h4>
        <TradeOptions
          :resourceReader="handleSendResources"
          :resources="recipientResources"
          :mode="'outgoing'"
          :text="'Your Offer'"
        ></TradeOptions>
      </b-form-group>

      <!-- send trade request -->
      <b-button type="submit" block variant="light" :disabled="!validateTrade" class="text-center">
        <p class="text-bold my-auto">Send Trade Request</p>
      </b-button>
    </b-form>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import TradeOptions from "@port-of-mars/client/components/game/phases/trade/TradeOptions.vue";
import { ResourceAmountData, Role, TradeAmountData } from "@port-of-mars/shared/types";
import { isZeroTrade, makeTradeSafe, canPlayerMakeTrade } from "@port-of-mars/shared/validation";
import { SendTradeRequestData } from "@port-of-mars/shared/game";
import { AbstractGameAPI } from "@port-of-mars/client/api/game/types";

@Component({
  components: {
    TradeOptions,
  },
})
export default class TradeRequest extends Vue {
  @Inject() readonly api!: AbstractGameAPI;
  selected = null;
  mainProps = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 110,
    height: 110,
  };

  created() {
    this.api.setTradePlayerName(this.$tstore.getters.player.role);
  }

  destroyed() {
    this.api.resetTradeModal();
  }

  get selectedTradePartner() {
    return this.$tstore.state.ui.tradeData.recipient.role;
  }

  get recipientResources() {
    return this.$tstore.state.ui.tradeData.recipient.resourceAmount;
  }

  get senderResources() {
    return this.$tstore.state.ui.tradeData.sender.resourceAmount;
  }

  get otherPlayers() {
    return Object.keys(this.$tstore.getters.otherPlayers);
  }

  get validateTrade(): boolean {
    const inventory = this.$tstore.getters.player.inventory;
    return (
      this.selectedTradePartner != "" &&
      canPlayerMakeTrade(this.recipientResources, inventory) &&
      !isZeroTrade(this.recipientResources, this.senderResources)
    );
  }

  handleSendResources(resources: ResourceAmountData) {
    this.api.setTradeGiveResources(resources);
  }

  handleReceiveResources(resources: ResourceAmountData) {
    this.api.setTradeGetResources(resources);
  }

  setTradeRecipient(name: string) {
    this.api.setTradePartnerName(name);
  }

  // FIXME: trade is only validated on click. needs to validate before hand so button is disabled properly
  createTrade() {
    if (this.validateTrade) {
      const senderPackage: TradeAmountData = {
        role: this.$tstore.state.role,
        resourceAmount: makeTradeSafe(this.recipientResources),
      };
      const recipientPackage: TradeAmountData = {
        role: this.selectedTradePartner as Role,
        resourceAmount: makeTradeSafe(this.senderResources),
      };
      const tradeDataPackage: SendTradeRequestData["trade"] = {
        sender: senderPackage,
        recipient: recipientPackage,
        status: "Active",
      };
      this.api.sendTradeRequest(tradeDataPackage);
      // FIXME: magic string declared in Trades.vue
      this.$bvModal.hide("trade-request-modal");
    }
  }

  borderStyle(role: string) {
    return (role as Role) === this.selectedTradePartner
      ? `0.125rem solid var(--light-accent)`
      : `0.125rem solid var(--color-${role})`;
  }

  frameStyle(role: string) {
    return (role as Role) === this.selectedTradePartner
      ? `var(--light-accent)`
      : `var(--color-${role})`;
  }
}
</script>
