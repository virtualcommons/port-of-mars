<template>
  <BContainer class="trade-request">
    <BRow class="trade-request-content">
      <BCol cols="8" class="trade-request-content-details">
        <p>Request from the <span class="request-member">{{ playerRole }}</span>:</p>
        <div class="request-assets">
          <AssetRequestInput />
          <AssetRequestInput />
          <AssetRequestInput />
          <AssetRequestInput />
          <AssetRequestInput />
        </div>
        <p>In exchange for:</p>
        <div class="exchange-assets">
          <AssetExchangeInput />
          <AssetExchangeInput />
          <AssetExchangeInput />
          <AssetExchangeInput />
          <AssetExchangeInput />
        </div>
      </BCol>
      <BCol cols="4" class="trade-request-content-shuffle">
        <button type="button" name="button">prev</button>
        <button type="button" name="button">next</button>
      </BCol>
    </BRow>
    <BRow class="trade-request-buttons">
      <button type="button" name="button" class="ghost-button">Ghost</button>
      <button type="button" name="button" class="send-button">Send</button>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import AssetRequestInput from '@/components/containers/Trading/AssetRequestInput.vue';
import AssetExchangeInput from '@/components/containers/Trading/AssetExchangeInput.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    AssetRequestInput,
    AssetExchangeInput,
  },
})

export default class TradeRequest extends Vue {
  get playerRole() {
    return this.$store.state.tradingMember;
  }
}
</script>

<style scoped>
.trade-request {
  position: absolute;
  z-index: 1;
  height: 100%;
  width: 100%;
  padding: 0;
  color: #F5F5F5;
  /* background-color: pink; */
}

.trade-request-content {
  height: 80%;
  width: 100%;
  margin: 0;
  /* background-color: blue; */
}

.trade-request-content-details {
  padding: 0 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  /* background-color: purple; */
}

.trade-request-content-details p {
  margin: 0;
}

.request-member {
  text-decoration: underline;
}

.request-assets {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /* background-color: black; */
  margin: 2rem 0;
}

.request-assets p {
  margin: 0;
}

.exchange-assets {
  margin: 2rem 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /* background-color: black; */
}

.exchange-assets p {
  margin: 0;
}

.trade-request-content-shuffle {
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* background-color: coral; */
}

.trade-request-content-shuffle button {
  color: #f5f5f5;
  background: none;
  border: none;
  text-decoration: underline;
  margin: 0;
}

.trade-request-content-shuffle button:hover {
  color: #c67b5c;
}

.trade-request-content-shuffle button:active {
  outline: none;
}

.trade-request-content-shuffle button:focus {
  outline: none;
}

.trade-request-buttons {
  height: 20%;
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* background-color: green; */
}

.ghost-button {
  visibility: hidden;
  height: 3rem;
  width: 12.5rem;
  border-radius: 0.5rem;
  border: 0.125rem solid #C67B5C;
  color: #F5F5F5;
  background: none;
}

.ghost-button:active {
  outline: none !important;
}

.ghost-button:focus {
  outline: none !important;
}

.send-button {
  height: 3rem;
  width: 12.5rem;
  border-radius: 0.5rem;
  border: 0.125rem solid #C67B5C;
  background-color: #C67B5C;
}

.send-button:focus {
  outline: none !important;
}

.send-button:active {
  outline: none !important;
}
</style>
