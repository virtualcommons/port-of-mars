<template>
  <div class="transparent-wrapper" :style="{ display: setStyle }">
    <BContainer class="wrapper reset">
      <BRow class="trading-modal-tabs">
        <div class="tab" @click="switchToRequest" :class="setActiveTab('request')">
          <p>Request Trade</p>
        </div>
        <div class="tab" @click="switchToIncoming" :class="setActiveTab('incoming')">
          <p>Incoming Trades</p>
        </div>
      </BRow>
      <BRow class="trading-modal">
        <BCol class="trading-modal-members" cols="3">
          <TradingMember
            :playerRole="'Researcher'"
            :notificationCount="0"
            :class="setActiveMember('Researcher')"
            class="trading-modal-members-seperator"/>
          <TradingMember
            :playerRole="'Curator'"
            :notificationCount="1"
            :class="setActiveMember('Curator')"
            class="trading-modal-members-seperator"/>
          <TradingMember
            :playerRole="'Entrepreneur'"
            :notificationCount="2"
            :class="setActiveMember('Entrepreneur')"
            class="trading-modal-members-seperator"/>
          <TradingMember
            :playerRole="'Pioneer'"
            :notificationCount="3"
            :class="setActiveMember('Pioneer')"
            class="trading-modal-members-bottom"/>
        </BCol>
        <BCol class="trading-modal-content" cols="9">
          <button class="close-button" @click="closeModal">Close</button>
          <component :is="switchView()" :playerRole="'Pioneer'"></component>
          <!-- ADD PROPER MEMBER -->
        </BCol>
      </BRow>
    </BContainer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import TradingMember from '@/components/gamedashboard/trading/TradingMember.vue';
import TradeRequest from '@/components/gamedashboard/trading/TradeRequest.vue';
import TradeIncoming from '@/components/gamedashboard/trading/TradeIncoming.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    TradingMember,
    TradeRequest,
    TradeIncoming,
  },
})

export default class TradingModal extends Vue {
  setStyle: string = 'none';

  get activeView() {
    return this.$store.state.tradingView;
  }

  get activeMember() {
    return this.$store.state.tradingMember;
  }

  mounted() {
    this.$root.$on('openTrading', (data: any) => {
      // Important: will need to set data type
      this.setStyle = '';
    });
  }

  switchView() {
    return (this.activeView === 'request' ? 'TradeRequest' : 'TradeIncoming');
  }

  setActiveTab(activeTab: string) {
    return (this.activeView === activeTab ? 'active' : '');
  }

  setActiveMember(member:string) {
    return (this.activeMember === member ? 'active' : '');
  }

  switchToRequest() {
    this.$store.dispatch('setTradingView', 'request');
  }

  switchToIncoming() {
    this.$store.dispatch('setTradingView', 'incoming');
  }

  switchMember(member: string) {
    this.$store.dispatch('setTradingMember', member);
    console.log(member); // eslint-disable-line no-use-before-define
  }

  closeModal() {
    this.setStyle = 'none';
  }
}
</script>

<style scoped>

.transparent-wrapper {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(30, 34, 35, 0.8);
  position: absolute;
  z-index: 1;
  top: 0;
  left: -83.5vw;
}

.wrapper {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.trading-modal-tabs {
  height: 3rem;
  width: 60rem;
  border-left: 0.125rem solid #F5F5F5;
  border-bottom: 0.125rem solid #F5F5F5;
  /* background-color: pink; */
}

.tab {
  height: 100%;
  width: 12rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #F5F5F5;
  background-color: #1E2223;
  border-right: 0.125rem solid #F5F5F5;
  border-top: 0.125rem solid #F5F5F5;
  cursor: pointer;
}

.active {
  color: #1E2223 !important;
  background-color: #c67b5c !important;
}

.tab p {
  margin: 0;
}

.tab-request-trades {
  color: #1E2223;
  background-color: #c67b5c;
}

.tab-incoming-trades {
  /* color: #1E2223; */
  /* background-color: #c67b5c; */
}

.trading-modal {
  width: 60rem;
  height: 35rem;
  margin: 0;
  padding: 0;
  background-color: #1e2223;
  border: 0.125rem solid #F5F5F5;
  border-top: none;
  border-radius: 0 0 1.25rem 1.25rem;
}

.trading-modal-members {
  height: 100%;
  padding: 0;
  border-right: 0.125rem solid #F5F5F5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* background-color: green; */
}

.trading-modal-content {
  height: 100%;
  padding: 0;
  position: relative;
  /* background-color: pink; */
}

.close-button {
  position: absolute;
  top: 2rem;
  right: 2rem;
  z-index: 2;
  text-decoration: underline;
  color: #F5F5F5;
  background: none;
  border: none;
}

.close-button:hover {
  color: #c67b5c;
}

.close-button:active {
  outline: none;
}

.trading-modal-members-bottom {
  border-bottom-left-radius: 1.25rem;
}

.trading-modal-members-seperator {
  border-bottom: 0.125rem solid #F5F5F5;
}
</style>
