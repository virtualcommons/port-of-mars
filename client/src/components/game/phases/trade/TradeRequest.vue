<template>
  <div class="trade-request-component tour-trade-component">
    <div class="trade-partner tour-trade-partner">
      <div class="wrapper trade-send">
        <p class="trade-title">
          Trade With:
          <span :class="{ none: tradePartnerName === '' }">{{
            tradePartnerName !== '' ? tradePartnerName : 'None Selected'
          }}</span>
        </p>
      </div>
      <div class="bottom-wrapper">
        <div
          class="trade-person-icons"
          v-for="(player, index) in otherPlayers"
          :key="index"
        >
          <div
            class="person-frame"
            v-bind:class="{ 'selected-player': tradePartnerName == player }"
          >
            <img
              @click="handleChange(player)"
              class="person-icons"
              :src="require(`@port-of-mars/client/assets/characters/${player}.png`)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="trade-send-options">
      <TradeOptions
        :resourceReader="handleSendResources"
        text="You give up"
        mode="outgoing"
        class="options-block tour-give-up"
        :resources="sentResources"
      />
      <TradeOptions
        :resourceReader="handleReceiveResources"
        text="In exchange for"
        mode="incoming"
        class="options-block tour-get-in-return"
        :resources="exchangeResources"
      />
      <button
        :disabled="!clientValidation"
        @click="handleTrade"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  InjectReactive,
  Inject
} from 'vue-property-decorator';
import * as _ from 'lodash';
import TradeOptions from './TradeOptions.vue';
import {
  TradeData,
  TradeAmountData,
  ResourceAmountData,
  RESOURCES,
  Role
} from '@port-of-mars/shared/types';
import { canPlayerMakeTrade } from '@port-of-mars/shared/validation';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { defaultInventory } from '@port-of-mars/client/store/state';
import { TutorialAPI } from '@port-of-mars/client/api/tutorial/request';

@Component({
  components: {
    TradeOptions
  }
})
export default class TradeRequest extends Vue {
  @Inject()
  readonly api!: GameRequestAPI & TutorialAPI;

  count = 0;

  created() {
    this.$tstore.commit(
      'SET_TRADE_PLAYER_NAME',
      this.$tstore.getters.player.role
    );
  }

  get tradePartnerName() {
    console.log(this.$tstore.state.ui.tradeData.to.role);
    return this.$tstore.state.ui.tradeData.to.role;
  }

  get sentResources() {
    return this.$tstore.state.ui.tradeData.to.resourceAmount;
  }

  get exchangeResources() {
    return this.$tstore.state.ui.tradeData.from.resourceAmount;
  }

  get otherPlayers() {
    return Object.keys(this.$tstore.getters.otherPlayers);
  }

  get clientValidation() {
    const inventory = this.$tstore.getters.player.inventory;
    return (
      this.tradePartnerName != '' &&
      canPlayerMakeTrade(this.sentResources, inventory)
    );
  }

  get isInTutorial() {
    return this.$tstore.getters.layout === 'tutorial';
  }

  tutorialValidation(type: string) {
    if (this.isInTutorial) {
      switch (type) {
        case 'give':
          this.api.saveGiveResources(this.sentResources);
          break;
        case 'get':
          this.api.saveGetResources(this.exchangeResources);
          break;
        case 'partner':
          this.api.saveTradePartner(this.tradePartnerName);
          break;
        default:
          break;
      }
    }
  }

  handleSendResources(resources: ResourceAmountData) {
    //this.sentResources = resources;
    this.$tstore.commit('SET_SEND_RESOURCES', resources);

    this.tutorialValidation('give');
  }

  handleReceiveResources(resources: ResourceAmountData) {
    //this.exchangeResources = resources;
    this.$tstore.commit('SET_GET_RESOURCES', resources);

    this.tutorialValidation('get');
  }

  handleChange(name: string) {
    console.log(name);
    if (name == this.tradePartnerName) {
      this.$tstore.commit('SET_TRADE_PARTNER_NAME', '' as Role);
      //this.name = '';
    } else {
      //this.name = name;
      this.$tstore.commit('SET_TRADE_PARTNER_NAME', name as Role);
      this.tutorialValidation('partner');
    }
  }

  handleTrade() {
    if (this.clientValidation) {
      const fromPackage: TradeAmountData = {
        role: this.$tstore.state.role,
        resourceAmount: this.sentResources
      };

      const toPackage: TradeAmountData = {
        role: this.tradePartnerName as Role,
        resourceAmount: this.exchangeResources
      };

      const tradeDataPackage: TradeData = {
        from: fromPackage,
        to: toPackage
      };

      this.api.sendTradeRequest(tradeDataPackage);

      if (!this.isInTutorial) {
        this.$tstore.commit('RESET_TRADE_MODAL', 'data');
        this.$tstore.commit('SET_TRADE_REQUEST_MODAL_VISIBILITY', false);
      }
    }
  }

  destroyed() {
    this.$tstore.commit('RESET_TRADE_MODAL', 'data');
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/trade/TradeRequest.scss';
</style>
