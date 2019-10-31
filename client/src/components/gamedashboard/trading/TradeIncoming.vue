<template>
  <BContainer class="trade-incoming">
    <BRow class="trade-incoming-content">
      <BCol cols="8" class="trade-incoming-content-details">
        <p>The <span class="request-member">{{ playerRole }}</span> wants:</p>
        <div class="incoming-assets">
          <AssetRequest />
          <AssetRequest />
          <AssetRequest />
          <AssetRequest />
          <AssetRequest />
        </div>
        <p>In exchange for:</p>
        <div class="exchange-assets">
          <AssetExchange />
          <AssetExchange />
          <AssetExchange />
          <AssetExchange />
          <AssetExchange />
        </div>
      </BCol>
      <BCol cols="4" class="trade-incoming-content-shuffle">
        <button type="button" name="button">prev</button>
        <button type="button" name="button">next</button>
      </BCol>
    </BRow>
    <BRow class="trade-incoming-buttons">
      <button type="button" name="button" class="decline-button">Decline</button>
      <button type="button" name="button" class="send-button">Accept</button>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import AssetRequest from '@/components/gamedashboard/trading/AssetRequest.vue';
import AssetExchange from '@/components/gamedashboard/trading/AssetExchange.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    AssetRequest,
    AssetExchange,
  },
})
export default class TradeIncoming extends Vue {
  get playerRole() {
    return this.$store.state.tradingMember;
  }
}
</script>

<style scoped>
.trade-incoming {
  position: absolute;
  z-index: 1;
  height: 100%;
  width: 100%;
  padding: 0;
  color: #f5f5f5;
  /* background-color: green; */
}

.trade-incoming-content {
  height: 80%;
  width: 100%;
  margin: 0;
  /* background-color: blue; */
}

.trade-incoming-content-details {
  padding: 0 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  /* background-color: purple; */
}

.trade-incoming-content-details p {
  margin: 0;
}

.request-member {
  text-decoration: underline;
}

.incoming-assets {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /* background-color: black; */
  margin: 2rem 0;
}

.incoming-assets p {
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

.trade-incoming-content-shuffle {
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* background-color: coral; */
}

.trade-incoming-content-shuffle button {
  color: #f5f5f5;
  background: none;
  border: none;
  text-decoration: underline;
  margin: 0;
}

.trade-incoming-content-shuffle button:hover {
  color: #c67b5c;
}

.trade-incoming-content-shuffle button:active {
  outline: none;
}

.trade-incoming-content-shuffle button:focus {
  outline: none;
}

.trade-incoming-buttons {
  height: 20%;
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* background-color: green; */
}

.decline-button {
  /* visibility: hidden; */
  height: 3rem;
  width: 12.5rem;
  border-radius: 0.5rem;
  border: 0.125rem solid #c67b5c;
  color: #f5f5f5;
  background: none;
}

.decline-button:active {
  outline: none !important;
}

.decline-button:focus {
  outline: none !important;
}

.send-button {
  height: 3rem;
  width: 12.5rem;
  border-radius: 0.5rem;
  border: 0.125rem solid #c67b5c;
  background-color: #c67b5c;
}

.send-button:focus {
  outline: none !important;
}

.send-button:active {
  outline: none !important;
}
</style>
