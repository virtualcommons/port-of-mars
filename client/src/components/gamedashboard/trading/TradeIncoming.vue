<template>
  <BContainer class="trade-incoming">
    <BRow class="trade-incoming-content">
      <BCol cols="8" class="trade-incoming-content-details">
        <p>The <span class="request-member">{{ playerRole }}</span> wants:</p>
        <div class="incoming-assets">
          <AssetRequest :value="0"/>
          <AssetRequest :value="1"/>
          <AssetRequest :value="2"/>
          <AssetRequest :value="1"/>
          <AssetRequest :value="0"/>
        </div>
        <p>In exchange for:</p>
        <div class="exchange-assets">
          <AssetExchange :value="1" :inventory="1"/>
          <AssetExchange :value="0" :inventory="0"/>
          <AssetExchange :value="0" :inventory="3"/>
          <AssetExchange :value="0" :inventory="1"/>
          <AssetExchange :value="2" :inventory="2"/>
        </div>
      </BCol>
      <BCol cols="4" class="trade-incoming-content-shuffle">
        <!-- Note: Shuffle to previous trade (needs implementation) -->
        <button type="button" name="button">prev</button>
        <!-- Note: Shuffle to next trade (needs implementation) -->
        <button type="button" name="button">next</button>
      </BCol>
    </BRow>
    <BRow class="trade-incoming-buttons">
      <!-- Note: Send decline event -->
      <button type="button" name="button" class="decline-button">Decline</button>
      <!-- Note: Send accept event -->
      <button type="button" name="button" class="accept-button">Accept</button>
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
  color: var(--space-white);
}

.trade-incoming-content {
  height: 80%;
  width: 100%;
  margin: 0;
}

.trade-incoming-content-details {
  height: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.trade-incoming-content-details p {
  margin: 0;
}

.request-member {
  text-decoration: underline;
}

.incoming-assets {
  margin: 2rem 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.incoming-assets p {
  margin: 0;
}

.exchange-assets {
  margin: 2rem 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.exchange-assets p {
  margin: 0;
}

.trade-incoming-content-shuffle {
  height: 100%;
  padding: 2rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.trade-incoming-content-shuffle button {
  margin: 0;
  border: none;
  text-decoration: underline;
  color: var(--space-white);
  background: none;
}

.trade-incoming-content-shuffle button:hover {
  color: var(--space-orange);
}

.trade-incoming-content-shuffle button:active, .trade-incoming-content-shuffle button:focus {
  outline: none;
}

.trade-incoming-buttons {
  height: 20%;
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.decline-button {
  height: 3rem;
  width: 12.5rem;
  border: 0.125rem solid var(--space-orange);
  border-radius: 0.5rem;
  color: var(--space-white);
  background: none;
}

.decline-button:active, .decline-button:focus {
  outline: none !important;
}

.accept-button {
  height: 3rem;
  width: 12.5rem;
  border: 0.125rem solid var(--space-orange);
  border-radius: 0.5rem;
  background-color: var(--space-orange);
}

.accept-button:focus, .accept-button:active {
  outline: none !important;
}
</style>
