<template>
  <div class="trade-request">
    <div class="trade-partner">
      <p>Who would you like to trade with?</p>
      <div class="trade-person-icons" v-for="(player, index) in otherPlayers" :key="index">
        <img
          @click="handleChange(player)"
          class="person-icons"
          :src="require(`@/assets/characters/${player}.png`)"
          v-bind:class="{ 'selected-player': name == player }"
        />
        <p>{{player}}</p>
      </div>
    </div>

    <div class="trade-send-options">
      <TradeOptions
        :resourceReader="handleSendResources"
        text="You give up"
        class="options-block"
      />
      <div class="options-block">
        <i class="fas fa-exchange-alt fa-2x"></i>
      </div>
      <TradeOptions
        :resourceReader="handleReciveResources"
        text="In exchange for"
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
import TradeOptions from './TradeOptions';
import { TradeData, TradeAmountData, ResourceAmountData } from 'shared/types';
import { GameRequestAPI } from '@/api/game/request';

@Component({
  components: {
    TradeOptions
  }
})
export default class TradeRequest extends Vue {
  name = "";

  get otherPlayers(){
    return Object.keys(this.$store.getters.otherPlayers);
  }

  get clientValidation(){
    let hasResourcesToSend = true;
    let someGreaterThanZero = false;
    const role = this.$store.state.role;
    const inventory = this.$store.state.players[role].inventory;

    Object.keys(this.sentResources).forEach(item => {
      if(this.sentResources[item] > inventory[item]){
        hasResourcesToSend = false;
      }
      if(this.sentResources[item] > 0) someGreaterThanZero = true;
    });

    return (this.name != "" && hasResourcesToSend && someGreaterThanZero);
  }

  @Inject()
  readonly api:GameRequestAPI;

  sentResources:ResourceAmountData = {};
  exchangeResources:ResourceAmountData = {};

  handleSendResources(resources){
    this.sentResources = resources;
  }

  handleReciveResources(resources){
    this.exchangeResources = resources;
  }

  handleChange(name){
    this.name = name;
  }

  handleTrade(){
    if(this.clientValidation){
      const fromPackage:TradeAmountData = {
        role:this.$store.state.role,
        resourceAmount:this.sentResources
      }

      const toPackage:TradeAmountData = {
        role:this.name,
        resourceAmount:this.exchangeResources
      }

      const tradeDataPackage:TradeData = {
        from:fromPackage,
        to:toPackage
      }

      this.api.sendTradeRequest(tradeDataPackage);
      this.name = "";
    }

  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/trading/TradeRequest.scss';
</style>
