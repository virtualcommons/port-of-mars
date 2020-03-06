<template>
  <div class="trade-request-component tour-trade-component">
    <div class="trade-partner tour-trade-partner">
      <p class="trade-title">
        Trade With:
        <span :class="{ none: tradePartnerName == '' }">{{
          tradePartnerName != '' ? tradePartnerName : 'None Selected'
        }}</span>
      </p>
      <div class="wrapper">
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
              :src="require(`@/assets/characters/${player}.png`)"
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
        v-show="tradePartnerName || isInTutorial"
        :key="count"
        :resources="sentResources"
      />
      <TradeOptions
        :resourceReader="handleReciveResources"
        text="In exchange for"
        mode="incoming"
        class="options-block tour-get-in-return"
        v-show="tradePartnerName || isInTutorial"
        :key="count + 'get'"
        :resources="exchangeResources"
      />
    </div>

    <!-- <div v-show="name != ''" class="error-messages">
      <p class="locked-trade" v-bind:class="{'show-error':!isTradeValid && name != '', 'hide-error':isTradeValid && name != ''}">You do not have enough free resources to make this trade.</p>
    </div> -->
    <div class="trade-send">
      <button v-show="tradePartnerName" :disabled="!clientValidation" @click="handleTrade">
        Send Trade
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
} from 'shared/types';
import { canPlayerMakeTrade} from 'shared/validation';
import { GameRequestAPI } from '@/api/game/request';
import { defaultInventory } from '@/store/state';
import { TutorialAPI } from '../../../../api/tutorial/request';

@Component({
  components: {
    TradeOptions
  }
})
export default class TradeRequest extends Vue {
  @Inject()
  readonly api!: GameRequestAPI & TutorialAPI;

  // sentResources!: ResourceAmountData;
  // exchangeResources!: ResourceAmountData;

  //name:string = '';
  count = 0;

  created() {
    // this.name = this.uiDefaultTradeData.to.role;
    // this.sentResources = this.uiDefaultTradeData.to.resourceAmount;
    // this.exchangeResources = this.uiDefaultTradeData.from.resourceAmount;
    this.$tstore.commit('SET_TRADE_PLAYER_NAME',this.$tstore.getters.player.role);
  }

  // updated(){
  //   this.name = this.uiDefaultTradeData.to.role;
  //   this.sentResources = this.uiDefaultTradeData.to.resourceAmount;
  //   this.exchangeResources = this.uiDefaultTradeData.from.resourceAmount;
  // }

  get tradePartnerName(){
    console.log(this.$tstore.state.ui.tradeData.to.role)
    return this.$tstore.state.ui.tradeData.to.role;
  }

  get sentResources(){
    return this.$tstore.state.ui.tradeData.to.resourceAmount;
  }

  get exchangeResources(){
    return this.$tstore.state.ui.tradeData.from.resourceAmount;
  }


  get uiDefaultTradeData(){
    console.log(this.$tstore.state.ui.tradeData);
    return this.$tstore.state.ui.tradeData;
  }

  get otherPlayers() {
    return Object.keys(this.$tstore.getters.otherPlayers);
  }

  get clientValidation() {
    const inventory = this.$tstore.getters.player.inventory;
    return this.tradePartnerName != '' && canPlayerMakeTrade(this.sentResources, inventory);
  }

  get isInTutorial(){
    if(process.env.NODE_ENV == 'test'){
      return true;
    }

    return this.$tstore.getters.layout === 'tutorial';
  }


  tutorialValidation(type:string){
    if (this.isInTutorial) {
      
      switch(type){
        case 'give':
          this.api.saveGiveResources(this.sentResources)
          break;
        case 'get':
          this.api.saveGetResources(this.exchangeResources)
          break;
        case 'partner':
          this.api.saveTradePartner(this.tradePartnerName)
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

  handleReciveResources(resources: ResourceAmountData) {
    //this.exchangeResources = resources;
    this.$tstore.commit('SET_GET_RESOURCES', resources);

    this.tutorialValidation('get');
  }

  handleChange(name: string) {
    console.log(name);
    if (name == this.tradePartnerName) {
      this.$tstore.commit('SET_TRADE_PARTNER_NAME','' as Role);
      //this.name = '';
    } else {
      //this.name = name;
      this.$tstore.commit('SET_TRADE_PARTNER_NAME',name as Role);
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
      // console.log(this.$tstore.state.ui.tradeData);

      if (!this.isInTutorial){
        // this.name = '';
        // this.sentResources = defaultInventory();
        // this.exchangeResources = defaultInventory();
        this.$tstore.commit('SET_TRADE_PARTNER_NAME','' as Role);
        this.$tstore.commit('SET_GET_RESOURCES', defaultInventory());
        this.$tstore.commit('SET_GET_RESOURCES', defaultInventory());
      }
      this.count+=1;

    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/trading/TradeRequest.scss';
</style>
