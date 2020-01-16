<template>
  <div class="trade-r">
    <div class="trade-partner">
      <p>Who would you like to trade with?</p>
      <div class="person-wrapper">
        <div class="trade-person-icons" v-for="(player, index) in otherPlayers" :key="index">
          <div class="person-frame"
            v-bind:class="{ 'selected-player': name == player }"
          >
            <img
              @click="handleChange(player)"
              class="person-icons"
              :src="require(`@/assets/characters/${player}.png`)"
              
            />
          </div>
          <p>{{player}}</p>
        </div>
      </div>
    </div>

    <div class="trade-send-options">
      <TradeOptions
        :resourceReader="handleSendResources"
        text="You give up"
        mode="outgoing"
        class="options-block"
      />
      <TradeOptions
        :resourceReader="handleReciveResources"
        text="In exchange for"
        mode="incoming"
        class="options-block"
      />
    </div>

    <div class="trade-send">
      <button v-bind:class="{'trade-impossible':!clientValidation}" @click="handleTrade">Send Trade</button>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, InjectReactive, Inject} from 'vue-property-decorator';
import * as _ from 'lodash';
import TradeOptions from './TradeOptions.vue';
import {TradeData, TradeAmountData, ResourceAmountData, RESOURCES, Role} from 'shared/types';
import { GameRequestAPI } from '@/api/game/request';
import {defaultInventory} from "@/store/state";

@Component({
  components: {
    TradeOptions
  }
})
export default class TradeRequest extends Vue {
  @Inject()
  readonly api!: GameRequestAPI;

  sentResources: ResourceAmountData = defaultInventory();
  exchangeResources: ResourceAmountData = defaultInventory();

  name = "";

  get otherPlayers(){
    return Object.keys(this.$store.getters.otherPlayers);
  }

  get clientValidation(){
    let hasResourcesToSend = true;
    let someGreaterThanZero = false;
    const role = this.$store.state.role;
    const inventory = this.$store.state.players[role].inventory;

    RESOURCES.forEach(item => {
      if(this.sentResources[item] > inventory[item]){
        hasResourcesToSend = false;
      }
      if(this.sentResources[item] > 0) someGreaterThanZero = true;
    });

    return (this.name != "" && hasResourcesToSend && someGreaterThanZero);
  }

  handleSendResources(resources: ResourceAmountData){
    this.sentResources = resources;
  }

  handleReciveResources(resources: ResourceAmountData){
    this.exchangeResources = resources;
  }

  handleChange(name: string){
    this.name = name;
  }

  handleTrade(){
    if(this.clientValidation){
      const fromPackage:TradeAmountData = {
        role: this.$store.state.role,
        resourceAmount: this.sentResources
      };

      const toPackage: TradeAmountData = {
        role: this.name as Role,
        resourceAmount: this.exchangeResources
      };

      const tradeDataPackage:TradeData = {
        from:fromPackage,
        to:toPackage
      };

      this.api.sendTradeRequest(tradeDataPackage);
      this.name = "";
    }

  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/trading/TradeRequest.scss';
</style>
