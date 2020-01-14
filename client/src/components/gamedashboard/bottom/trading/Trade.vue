<template>
  <div class="trade">
    <div class="trade-send-receive">
      <div class="trade-profile-sender-container">
        <div class="trade-profile-sender">
          <img :src="require(`@/assets/characters/${from.role}.png`)" alt="Sender" />
        </div>
      </div>
      <div class="send">
        <div class="send-sender">
          <p>{{ from.role }}</p>
        </div>
        <div class="send-investments-container">
          <div class="send-investments" v-for="(value, name) in from.resourceAmount" :key="name+3">
            <img v-if="value !== 0" :src="require(`@/assets/icons/${name}.svg`)" alt="Investment" />
            <p v-if="value !== 0">{{ value }}</p>
          </div>
        </div>
      </div>
      <div class="trade-icon">
        <i class="fas fa-exchange-alt fa-2x"></i>
      </div>
      <div class="trade-profile-receiver-container">
        <div class="trade-profile-receiver">
          <img :src="require(`@/assets/characters/${to.role}.png`)" alt="Receiver" />
        </div>
      </div>
      <div class="receive">
        <div class="receive-receiver">
          <p>{{ to.role }}</p>
        </div>
        <div class="receive-investments-container">
          <div class="receive-investments" v-for="(value, name) in to.resourceAmount" :key="name+2">
            <img v-if="value !== 0" :src="require(`@/assets/icons/${name}.svg`)" alt="Investment" />
            <p v-if="value !== 0">{{ value }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="trade-buttons">
       <button v-bind:class="{'accept-trade':!clientValidation}" v-show="role == to.role" type="button" name="button" @click="handleAcceptTrade">Accept</button>
      <button v-show="(role==from.role) || (role ==to.role)" type="button" name="button" @click="handleTradeReject">Decline</button>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, Prop, InjectReactive, Inject} from 'vue-property-decorator';
import { GameRequestAPI } from '@/api/game/request';
import {TradeData, TradeAmountData, INVESTMENTS, RESOURCES} from 'shared/types';

@Component({})
export default class Trade extends Vue {
  @Prop() private from!: TradeAmountData;
  @Prop() private to!: TradeAmountData;
  @Prop() private id!: string;

  private role = this.$store.state.role;

  @Inject() api!: GameRequestAPI;

  get clientValidation(){
    let hasResourcesToSend = true;
    const inventory = this.$store.state.players[this.role].inventory;

    RESOURCES.forEach(item => {
      if(this.to.resourceAmount[item] > inventory[item]){
        hasResourcesToSend = false;
      }
    });

    return hasResourcesToSend;
  }


  handleAcceptTrade() {
    if(this.clientValidation){
      this.api.acceptTradeRequest(this.id);
    }
  }

  handleTradeReject(){
    this.api.rejectTradeRequest(this.id);
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/trading/Trade.scss';
</style>
