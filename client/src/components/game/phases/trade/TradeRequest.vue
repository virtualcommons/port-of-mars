<template>
    <b-container fluid class="h-100 p-0 m-0">
      <b-form @submit="handleTrade">
        <!-- select trade partner -->
        <b-form-group class="w-100">
          <b-form-radio-group
            inline
            v-model="selectedTradePartner"
            button
            justify="center"
          >
            <b-form-radio
              v-for="player in otherPlayers"
              :value="player"
              :key="player">
<!--            <div-->
<!--              class="p-1 mr-3"-->
<!--              :style="borderStyle(player)"-->
<!--              style="border-radius: 50%; height: 5rem; width: 5rem"-->
<!--            >-->
<!--              <div class="inner-frame" :style="frameStyle(player)">-->
<!--                <img-->
<!--                  :src="-->
<!--                  require(`@port-of-mars/client/assets/characters/${player}.png`)-->
<!--                "-->
<!--                  alt="Player"-->
<!--                />-->
<!--              </div>-->
<!--              -->
<!--            </div>-->
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>

        <!-- request -->
        <b-form-group>
          <TradeOptions
            :resourceReader="handleReceiveResources"
            :resources="senderResources"
            :mode="'incoming'"
            :text="'Your Request'"
            class="tour-request-resources"
          ></TradeOptions>
        </b-form-group>

        <!-- send resources -->
        <b-form-group>
          <TradeOptions
          :resourceReader="handleSendResources"
          :resources="recipientResources"
          :mode="'outgoing'"
          :text="'Your Offer'"
          class="tour-offer-resources"
        ></TradeOptions>
        </b-form-group>

        <!-- send trade -->
        <b-button
          @click="handleTrade"
          :disabled="!validateTrade"
          class="tour-send-trade"
          ref="sendTrade"
        >
          Send Trade Request
        </b-button>
      </b-form>
    </b-container>
</template>

<script lang="ts">
import {Component, Inject, Vue, Watch} from 'vue-property-decorator';
import TradeOptions from '@port-of-mars/client/components/game/phases/trade/TradeOptions.vue';
import {ResourceAmountData, Role, TradeAmountData,} from '@port-of-mars/shared/types';
import {isZeroTrade, makeTradeSafe, canPlayerMakeTrade} from '@port-of-mars/shared/validation';
import {SendTradeRequestData} from "@port-of-mars/shared/game";
import {AbstractGameAPI} from "@port-of-mars/client/api/game/types";

@Component({
  components: {
    TradeOptions,
  },
})
export default class TradeRequest extends Vue {
  @Inject() readonly api!: AbstractGameAPI;

  created() {
    this.api.setTradePlayerName(this.$tstore.getters.player.role);
  }

  destroyed() {
    this.api.resetTradeModal();
  }

  // NOTE :: STATE GETTERS

  get selectedTradePartner() {
    return this.$tstore.state.ui.tradeData.recipient.role;
  }

  set selectedTradePartner(value: string) {
    if (value == this.selectedTradePartner) {
      this.api.setTradePartnerName('');
    } else {
      this.api.setTradePartnerName(value);
    }
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
    console.log('validate trade: ', this.selectedTradePartner != '' &&
      canPlayerMakeTrade(this.recipientResources, inventory) &&
      !isZeroTrade(this.recipientResources, this.senderResources));

    return (
      this.selectedTradePartner != '' &&
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

  // FIXME: trade is only validated on click. needs to validate before hand so button is disabled properly
  handleTrade() {
    if (this.validateTrade()) {
      const senderPackage: TradeAmountData = {
        role: this.$tstore.state.role,
        resourceAmount: makeTradeSafe(this.recipientResources),
      };
      const recipientPackage: TradeAmountData = {
        role: this.selectedTradePartner as Role,
        resourceAmount: makeTradeSafe(this.senderResources),
      };
      const tradeDataPackage: SendTradeRequestData['trade'] = {
        sender: senderPackage,
        recipient: recipientPackage,
        status: 'Active',
      };
      this.api.sendTradeRequest(tradeDataPackage);
      this.$root.$emit('bv::hide::modal', 'gameModal', '#sendTrade')
      this.api.setModalHidden();
    }
  }


  // NOTE :: STYLES
  borderStyle(role: Role) {
    return role === this.selectedTradePartner
      ? {border: `0.125rem solid var(--light-accent)`}
      : {border: `0.125rem solid var(--color-${role})`};
  }

  frameStyle(role: Role) {
    return role === this.selectedTradePartner
      ? {backgroundColor: `var(--light-accent)`}
      : {backgroundColor: `var(--color-${role})`};
  }
}
</script>
