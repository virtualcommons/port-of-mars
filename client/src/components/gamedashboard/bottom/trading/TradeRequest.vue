<template>
  <div class="trade-request-component tour-trade-component">
    <div class="trade-partner tour-trade-partner">
      <p class="trade-title">
        Trade With:
        <span :class="{ none: name === '' }">{{
          name !== '' ? name : 'None Selected'
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
            v-bind:class="{ 'selected-player': name == player }"
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
        v-show="name || isInTutorial"
        :key="count"
        :resources="sentResources"
      />
      <TradeOptions 
        :resourceReader="handleReciveResources"
        text="In exchange for"
        mode="incoming"
        class="options-block tour-get-in-return"
        v-show="name || isInTutorial"
        :key="count + 'get'"
        :resources="exchangeResources"
      />
    </div>

    <!-- <div v-show="name != ''" class="error-messages">
      <p class="locked-trade" v-bind:class="{'show-error':!isTradeValid && name != '', 'hide-error':isTradeValid && name != ''}">You do not have enough free resources to make this trade.</p>
    </div> -->
    <div class="trade-send">
      <button v-show="name" :disabled="!clientValidation" @click="handleTrade">
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

  sentResources: ResourceAmountData = this.defaultGiveResources;
  exchangeResources: ResourceAmountData = this.defaultGetResources;

  name = this.defaultTradePartner;
  count = 0;


  get defaultTradePartner(): string{
    
    return this.$tstore.state.tutorialTradePartner;
  }

  get defaultGiveResources(): ResourceAmountData{
    
    return this.$tstore.state.tutorialTradeGive;
  }

  get defaultGetResources(): ResourceAmountData{
    console.log(this.$tstore.state.tutorialTradeGet);
    return this.$tstore.state.tutorialTradeGet;
  }

  get otherPlayers() {
    return Object.keys(this.$store.getters.otherPlayers);
  }

  get clientValidation() {
    const inventory = this.$store.getters.player.inventory;
    return this.name != '' && canPlayerMakeTrade(this.sentResources, inventory);
  }

  get isInTutorial(){
    if(this.$store.getters.layout == 'tutorial'){
      return true;
    }
    return false;
  }


  tutorialValidation(type:string){
    if(this.isInTutorial){

      switch(type){
        case 'give':
          this.api.saveGiveResources(this.sentResources)
          break;
        case 'get':
          this.api.saveGetResources(this.exchangeResources)
          break;
        case 'partner':
          this.api.saveTradePartner(this.name)
          break;
        default:
          break;
      }
    }
  }


  handleSendResources(resources: ResourceAmountData) {
    this.sentResources = resources;

    this.tutorialValidation('give');
  }

  handleReciveResources(resources: ResourceAmountData) {
    this.exchangeResources = resources;

    this.tutorialValidation('get');
  }

  handleChange(name: string) {
    if (name == this.name) {
      this.name = '';
    } else {
      this.name = name;
      this.tutorialValidation('partner');
    }
    
  }

  handleTrade() {
    if (this.clientValidation) {
      const fromPackage: TradeAmountData = {
        role: this.$store.state.role,
        resourceAmount: this.sentResources
      };

      const toPackage: TradeAmountData = {
        role: this.name as Role,
        resourceAmount: this.exchangeResources
      };

      const tradeDataPackage: TradeData = {
        from: fromPackage,
        to: toPackage
      };

      this.api.sendTradeRequest(tradeDataPackage);
      if (!this.isInTutorial){
        this.name = '';
        this.sentResources = defaultInventory();
        this.exchangeResources = defaultInventory();
      } 
      this.count+=1;
      
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/trading/TradeRequest.scss';
</style>
