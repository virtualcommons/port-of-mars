<template>
  <div class="c-trade container" :style="statusColor('borderColor')"
    v-bind:class="{'hide-trade': !tradeIsActive}"
    v-show="showTrade">
    <div class="title-wrapper" :style="statusColor('backgroundColor')">
      <p class="title" :style="textColor">New Trade Request</p>
    </div>
    <div class="trade-wrapper row">
      <div class="to-container col">
        <div class="inner-wrapper row">
          <div class="player col-4">
            <div class="outer-frame" :style="borderStyle(to.role)">
              <div class="inner-frame" :style="frameStyle(to.role)">
                <img
                  :src="
                    require(`@port-of-mars/client/assets/characters/${to.role}.png`)
                  "
                  alt="Player To"
                />
              </div>
            </div>
            <div class="text">
              <p class="title">Request</p>
              <p class="player-text">{{ to.role }}</p>
            </div>
          </div>
          <div class="investments col-8">
            <div
              class="wrapper"
              v-for="(value, name) in to.resourceAmount"
              :key="name + Math.random()"
            >
              <img
                :src="require(`@port-of-mars/client/assets/icons/${name}.svg`)"
                alt="Investment"
              />
              <p v-if="value !== 0">{{ value }}</p>
              <p v-if="value === 0">-</p>
            </div>
          </div>
        </div>
      </div>
      <div class="icon-container col-1">
        <font-awesome-icon
          :icon="['fas', 'exchange-alt']"
          size="lg"
          class="icon"
        />
      </div>
      <div class="from-container col">
        <div class="inner-wrapper row">
          <div class="player col-4">
            <div class="outer-frame" :style="borderStyle(from.role)">
              <div class="inner-frame" :style="frameStyle(from.role)">
                <img
                  :src="
                    require(`@port-of-mars/client/assets/characters/${from.role}.png`)
                  "
                  alt="Player To"
                />
              </div>
            </div>
            <div class="text">
              <p class="title">Offer</p>
              <p class="player-text">{{ from.role }}</p>
            </div>
          </div>
          <div class="investments col-8">
            <div
              class="wrapper"
              v-for="(value, name) in from.resourceAmount"
              :key="name + Math.random()"
            >
              <img
                :src="require(`@port-of-mars/client/assets/icons/${name}.svg`)"
                alt="Investment"
              />
              <p v-if="value !== 0">{{ value }}</p>
              <p v-if="value === 0">-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="button-wrapper" v-show="tradeIsActive">
      <button
        v-if="role === to.role && role !== from.role"
        @click="handleTradeReject"
        class="decline"
      >
        <font-awesome-icon :icon="['fas', 'times']" size="sm" class="icon" />
      </button>
      <button
        v-if="role === to.role && role !== from.role"
        @click="handleAcceptTrade"
        :disabled="!clientValidation"
        class="accept"
      >
        <font-awesome-icon :icon="['fas', 'check']" size="sm" class="icon" />
      </button>
      <button
        v-if="role === from.role && role !== to.role"
        @click="handleTradeCancel"
        class="cancel"
      >
        <font-awesome-icon :icon="['fas', 'times']" size="sm" class="icon" />
      </button>
    </div>
    <div class="status-text" :style="statusColor('color')" v-show="!tradeIsActive">
      <p>Trade Status: {{status}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject, Watch } from 'vue-property-decorator';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { TradeAmountData, RESOURCES, Role, TradeStatus } from '@port-of-mars/shared/types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons/faExchangeAlt';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';

library.add(faExchangeAlt);
library.add(faTimes);
library.add(faCheck);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({})
export default class ActiveTrade extends Vue {
  //who sent the trade
  @Prop() private from!: TradeAmountData;
  
  //who is receiving the trade
  @Prop() private to!: TradeAmountData;
  
  //id on the trade
  @Prop() private id!: string;
  
  //status of the trade -> 'Active' | 'Accepted' | 'Cancelled' | 'Rejected'
  @Prop() private status!:string;
  
  //degree of participation -> 1 | 0 | -1
  @Prop() private participant!:number;

  @Inject() api!: GameRequestAPI;

  //internal state for whether or not the trade should be shown
  //showTrade is the root element dictates whether or not the trade should be shown
  private showTrade = true;

  //tradeIsActive dictates what animation should be playing
  private tradeIsActive = true;

  mounted(){
    if(this.status != 'Active'){
      //we want to immediately hide the trade if, as the trade mounts, it's already inactive
      this.tradeIsActive = false;
      this.showTrade = false;
    }
  }

  //this watches to see when status changes
  @Watch('status', {immediate: true})
  shouldShowTrade(status:string){
    if(status != 'Active'){
      //we want to immediatly start the hiding animation on the trade
      this.tradeIsActive = false;
      //we want to set the trade to hidden, but only after 1900 seconds
      setTimeout(() => this.showTrade = false, 1900);
    }
  }

  get role() {
    return this.$tstore.state.role;
  }

  get clientValidation() {
    //this just makes sure that the local user can accept the trade.
    const inventory = this.$store.state.players[this.role].inventory;
    RESOURCES.forEach((item) => {
      if (this.to.resourceAmount[item] > inventory[item]) {
        return false;
      }
    });
    return true;
  }

  private handleAcceptTrade() {
    if (this.clientValidation) {
      this.api.acceptTradeRequest(this.id);
    }
  }

  private handleTradeReject() {
    this.api.rejectTradeRequest(this.id);
  }

  private handleTradeCancel() {
    this.api.cancelTradeRequest(this.id);
  }

  //the border on the player portait background
  private borderStyle(role: Role) {
    return { border: `0.2rem solid var(--color-${role})` };
  }

  //the frame of the player portait background
  private frameStyle(role: Role) {
    return { backgroundColor: `var(--color-${role})` };
  }

  //color of the trade header and trade background
  statusColor(type:string){
    //default is white
    let color = 'white';

    //if the player is involved with the trade, color it orange
    if(this.participant == 1 || this.participant == 0){
      color = 'var(--new-space-orange)';
    }

    //alternate statuses supersede involvement
    if(this.status == 'Accepted'){
      color = 'var(--status-green)'
    }
    else if(this.status == 'Cancelled' || this.status == 'Rejected'){
      color = 'var(--status-red)'
    }
    
    //map to whatever type was passed in
    return {[type]: color};
    
  }

  //text color handling
  get textColor(){
    console.log(this.status);
    if(this.status != 'Active'){
      return {color: 'white'}
    }

    return {color:'black'};
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/trade/ActiveTrade.scss';
</style>
