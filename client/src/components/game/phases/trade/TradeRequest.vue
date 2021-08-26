<template>
  <!--  <b-container fluid class="h-100 p-0 m-0">-->
  <!--    <b-form @submit="handleTrade">-->
  <!--      &lt;!&ndash; select trade partner &ndash;&gt;-->
  <!--      <b-form-group class="w-100">-->
  <!--        <b-form-radio-->
  <!--          inline-->
  <!--          v-model="tradePartnerName"-->
  <!--          v-for="player in otherPlayers"-->
  <!--          :value="player" :key="player"-->
  <!--          @click="handleChange(player)"-->
  <!--          button-->
  <!--          justify="center"-->
  <!--        >-->
  <!--          <div-->
  <!--            class="p-1 mr-3"-->
  <!--            :style="borderStyle(player)"-->
  <!--            style="border-radius: 50%; height: 5rem; width: 5rem"-->
  <!--          >-->
  <!--            <div class="inner-frame" :style="frameStyle(player)">-->
  <!--              <img-->
  <!--                :src="-->
  <!--                require(`@port-of-mars/client/assets/characters/${player}.png`)-->
  <!--              "-->
  <!--                alt="Player"-->
  <!--              />-->
  <!--            </div>-->
  <!--          </div>-->
  <!--        </b-form-radio>-->
  <!--      </b-form-group>-->

  <!--      &lt;!&ndash; request &ndash;&gt;-->
  <!--      <b-form-group>-->
  <!--        <TradeOptions-->
  <!--          :resourceReader="handleReceiveResources"-->
  <!--          :resources="senderResources"-->
  <!--          :mode="'incoming'"-->
  <!--          :text="'Your Request'"-->
  <!--          class="tour-request-resources"-->
  <!--        ></TradeOptions>-->
  <!--      </b-form-group>-->

  <!--      &lt;!&ndash; offer &ndash;&gt;-->
  <!--      <b-form-group>-->
  <!--        <TradeOptions-->
  <!--          :resourceReader="handleSendResources"-->
  <!--          :resources="recipientResources"-->
  <!--          :mode="'outgoing'"-->
  <!--          :text="'Your Offer'"-->
  <!--          class="tour-offer-resources"-->
  <!--        ></TradeOptions>-->
  <!--      </b-form-group>-->

  <!--      &lt;!&ndash; send trade request &ndash;&gt;-->
  <!--      <b-button-->
  <!--        block-->
  <!--        pressed-->
  <!--        type="submit"-->
  <!--        :disabled="!validateTrade"-->
  <!--        class="text-center tour-send-trade">-->
  <!--        <p class="text-bold">Send trade request</p>-->
  <!--      </b-button>-->
  <!--    </b-form>-->
  <!--  </b-container>-->
  <!-- FIXME: refactor to b-form -->
  <div class="c-trade-request container tour-trade-request">
    <p>Trade Partner</p>
    <div class="player-selection-wrapper row tour-request-trade-partner">
      <!-- select trade partner -->
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

    <!-- request resources -->
    <div class="request-wrapper row">
      <div class="request col-12">
        <TradeOptions
          :resourceReader="handleReceiveResources"
          :resources="senderResources"
          :mode="'incoming'"
          :text="'Your Request'"
          class="tour-request-resources"
        />
      </div>
    </div>

    <!-- offer resources -->
    <div class="offer-wrapper row">
      <div class="offer col-12">
        <TradeOptions
          :resourceReader="handleSendResources"
          :resources="recipientResources"
          :mode="'outgoing'"
          :text="'Your Offer'"
          class="tour-offer-resources"
        />
      </div>
    </div>

    <!-- FIXME: add disable button styling if trade is not valid -->
    <div class="buttons-wrapper row">
      <div class="buttons col-12">
        <b-button
          @click="handleTrade"
          :disabled="!validateTrade"
          class="tour-send-trade"
          ref="sendTrade"
        >
          Send Trade Request
        </b-button>
      </div>
    </div>
  </div>
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

  get tradePartnerName() {
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

  handleChange(name: string) {
    if (name == this.tradePartnerName) {
      this.api.setTradePartnerName('');
    } else {
      this.api.setTradePartnerName(name);
    }
  }

  validateTrade(): boolean {
    const inventory = this.$tstore.getters.player.inventory;
    console.log('validate trade: ', this.tradePartnerName != '' &&
      canPlayerMakeTrade(this.recipientResources, inventory) &&
      !isZeroTrade(this.recipientResources, this.senderResources));

    return (
      this.tradePartnerName != '' &&
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
        role: this.tradePartnerName as Role,
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
    return role === this.tradePartnerName
      ? {border: `0.125rem solid var(--light-accent)`}
      : {border: `0.125rem solid var(--color-${role})`};
  }

  frameStyle(role: Role) {
    return role === this.tradePartnerName
      ? {backgroundColor: `var(--light-accent)`}
      : {backgroundColor: `var(--color-${role})`};
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/trade/TradeRequest.scss';
</style>
