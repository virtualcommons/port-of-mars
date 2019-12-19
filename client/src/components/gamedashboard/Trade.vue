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
            <img
              v-if="value !== 0"
              :src="require(`@/assets/iconsSVG/${name}.svg`)"
              alt="Investment"
            />
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
            <img
              v-if="value !== 0"
              :src="require(`@/assets/iconsSVG/${name}.svg`)"
              alt="Investment"
            />
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

<style scoped>
.trade {
  width: 100%;
  height: 4rem;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--space-white-opaque-1);
}

.trade:last-child {
  margin-bottom: 0;
}

.trade-icon {
  margin: 0 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.trade-icon i {
  color: var(--space-white);
}

.trade-profile-sender-container,
.trade-profile-receiver-container {
  height: 100%;
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.trade-profile-sender,
.trade-profile-receiver {
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--space-white);
}

.trade-profile-sender img,
.trade-profile-receiver img {
  height: 100%;
}

.trade-send-receive {
  height: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: space-around;
}

.send,
.receive {
  height: 100%;
  flex-grow: 1;
  max-width: 18rem;
  margin: 0 0.5rem;
  display: flex;
  flex-direction: column;
}

.send-sender,
.receive-receiver {
  height: 50%;
  padding: 0.25rem 0.5rem;
  display: flex;
  align-items: center;
}

.send-sender p,
.receive-receiver p {
  width: 100%;
  margin: 0;
  font-size: var(--font-small);
  text-align: center;
  color: var(--space-gray);
  background-color: var(--space-orange);
}

.send-investments-container,
.receive-investments-container {
  height: 50%;
  padding: 0.25rem 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.send-investments,
.receive-investments {
  height: 100%;
  display: flex;
  align-items: center;
}

.send-investments img,
.receive-investments img {
  height: 1.5rem;
  width: 1.5rem;
}

.send-investments p,
.receive-investments p {
  margin: 0 0.5rem;
  font-size: var(--font-small);
}

.trade-buttons {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.trade-buttons button {
  height: 50%;
  width: 4rem;
  border: none;
  font-size: var(--font-small);
  background-color: var(--space-orange);
  transition: all 0.2s ease-in-out;
}

.trade-buttons button:hover {
  transform: scale(1.1);
}
</style>
