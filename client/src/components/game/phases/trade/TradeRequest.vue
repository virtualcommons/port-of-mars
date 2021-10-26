<template>
  <b-container fluid class="h-100 p-0 m-0">
    <b-form @submit.stop.prevent="createTrade">
      <!-- select trade partner -->
      <b-form-group class="w-100 my-4 tour-send-trade">
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
          v-b-tooltip:bottom="player"
          :style="{ border: borderStyle(player) }"
        >
          <b-img
            v-bind="mainProps"
            :src="require(`@port-of-mars/client/assets/characters/${player}.png`)"
            :alt="player"
            :style="{ backgroundColor: frameStyle(player) }"
          >
          </b-img>
        </b-form-radio>
      </b-form-group>
      <!-- request -->
      <b-form-group>
        <TradeOptions
          :resourceReader="handleReceiveResources"
          :resources="senderResources"
          :mode="'incoming'"
          :text="'Your Request'"
        ></TradeOptions>
      </b-form-group>

      <!-- offer -->
      <b-form-group>
        <TradeOptions
          :resourceReader="handleSendResources"
          :resources="recipientResources"
          :mode="'outgoing'"
          :text="'Your Offer'"
        ></TradeOptions>
      </b-form-group>

      <!-- send trade request -->
      <b-button
        type="submit"
        block
        variant="outline-secondary"
        :disabled="!validateTrade"
        class="text-center"
      >
        <p class="text-bold my-auto">Send trade request</p>
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
    TradeOptions
  }
})
export default class TradeRequest extends Vue {
  @Inject() readonly api!: AbstractGameAPI;
  selected = null;
  mainProps = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 125,
    height: 125
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

  validateTrade(): boolean {
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
    if (this.validateTrade()) {
      const senderPackage: TradeAmountData = {
        role: this.$tstore.state.role,
        resourceAmount: makeTradeSafe(this.recipientResources)
      };
      const recipientPackage: TradeAmountData = {
        role: this.selectedTradePartner as Role,
        resourceAmount: makeTradeSafe(this.senderResources)
      };
      const tradeDataPackage: SendTradeRequestData["trade"] = {
        sender: senderPackage,
        recipient: recipientPackage,
        status: "Active"
      };
      this.api.sendTradeRequest(tradeDataPackage);
      this.$root.$emit("bv::hide::modal", "gameModal");
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
