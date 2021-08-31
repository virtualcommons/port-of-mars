<template>
  <b-container fluid class="h-100 p-0 m-0">
    <b-form @submit="handleTrade">
      <!-- select trade partner -->
      <b-form-group class="w-100">
        <b-form-radio-group
          inline
          v-model="selected"
          :options="otherPlayers"
          @change="handleChange(selected)"
          justify="center"
          buttons
        >
<!--          <template #default>-->
<!--            <div class="player-selection-wrapper row tour-request-trade-partner">-->
<!--              &lt;!&ndash; select trade partner &ndash;&gt;-->
<!--              <div class="player col-3" v-for="player in otherPlayers" :key="player">-->
<!--                <button-->
<!--                  @click="handleChange(player)"-->
<!--                  class="outer-frame"-->
<!--                  :style="borderStyle(player)"-->
<!--                >-->
<!--                  <div class="inner-frame" :style="frameStyle(player)">-->
<!--                    <img-->
<!--                      :src="-->
<!--                            require(`@port-of-mars/client/assets/characters/${player}.png`)-->
<!--                          "-->
<!--                      alt="Player"-->
<!--                    />-->
<!--                  </div>-->
<!--                </button>-->
<!--                <p>{{ player }}</p>-->
<!--              </div>-->
<!--          </template>-->
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

      <!-- offer -->
      <b-form-group>
        <TradeOptions
          :resourceReader="handleSendResources"
          :resources="recipientResources"
          :mode="'outgoing'"
          :text="'Your Offer'"
          class="tour-offer-resources"
        ></TradeOptions>
      </b-form-group>

      <!-- send trade request -->
      <b-button
        type="submit"
        block
        pressed
        :disabled="!validateTrade"
        class="text-center tour-send-trade"
        ref="send-trade"
      >
        <p class="text-bold">Send trade request</p>
      </b-button>
    </b-form>
  </b-container>
</template>

<script lang="ts">
import {Component, Inject, Vue} from 'vue-property-decorator';
import TradeOptions from '@port-of-mars/client/components/game/phases/trade/TradeOptions.vue';
import {ResourceAmountData, Role, TradeAmountData} from '@port-of-mars/shared/types';
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
  selected = null;

  created() {
    this.api.setTradePlayerName(this.$tstore.getters.player.role);
  }

  destroyed() {
    this.api.resetTradeModal();
  }

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
    let options: { text: string; value: string; }[] = [];
    const players = Object.keys(this.$tstore.getters.otherPlayers);
    players.forEach((value) => {
      options.push({text: value, value});
    });
    return options;
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

  handleChange(name: string) {
    this.api.setTradePartnerName(name);
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

<style scoped lang="scss">
.outer-frame {
  @include reset-button;
  height: 5rem;
  width: 5rem;
  padding: 0.125rem;
  margin: 0 0 0.5rem 0;
  border-radius: 50%;
}

.inner-frame {
  @include expand;
  border-radius: 50%;
  @include make-center;
}

img {
  object-fit: cover;
  height: 80%;
}

p {
  margin-bottom: 0;
  font-size: $font-med;
  font-weight: $medium;
  color: $light-shade;
  text-align: center;
}

</style>
