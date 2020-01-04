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
          <div class="send-investments" v-for="(value, name) in from.resourceAmount">
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
          <div class="receive-investments" v-for="(value, name) in to.resourceAmount">
            <img v-if="value !== 0" :src="require(`@/assets/icons/${name}.svg`)" alt="Investment" />
            <p v-if="value !== 0">{{ value }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="trade-buttons">
      <button type="button" name="button" @click="handleAcceptTrade">Accept</button>
      <button type="button" name="button">Decline</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';
import { GameRequestAPI } from '@/api/game/request';
import { TradeData } from 'shared/types';

@Component({})
export default class Trade extends Vue {
  @Prop() private from: object;
  @Prop() private to: object;
  @Prop() private id: string;

  @Inject() $api!: GameRequestAPI;

  handleAcceptTrade() {
    this.$api.acceptTradeRequest(this.id);
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/trading/Trade.scss';
</style>
