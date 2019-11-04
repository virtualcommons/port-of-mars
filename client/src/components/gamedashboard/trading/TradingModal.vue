<template>
  <div class="tm-transparent-wrapper" :style="{ display: setStyle }">
    <BContainer class="tm-wrapper">
      <BRow class="tm-tabs">
        <div class="tm-tabs-tab" @click="setView('request')" :class="setActiveTab('request')">
          <p>Request Trade</p>
        </div>
        <div class="tm-tabs-tab" @click="setView('incoming')" :class="setActiveTab('incoming')">
          <p>Incoming Trades</p>
        </div>
      </BRow>
      <BRow class="tm">
        <BCol class="tm-members" cols="3">
          <TradingMember
            :playerRole="'Researcher'"
            :notificationCount="0"
            :class="setActiveMember('Researcher')"
            class="tm-members-seperator"/>
          <TradingMember
            :playerRole="'Curator'"
            :notificationCount="1"
            :class="setActiveMember('Curator')"
            class="tm-members-seperator"/>
          <TradingMember
            :playerRole="'Entrepreneur'"
            :notificationCount="2"
            :class="setActiveMember('Entrepreneur')"
            class="tm-members-seperator"/>
          <TradingMember
            :playerRole="'Pioneer'"
            :notificationCount="3"
            :class="setActiveMember('Pioneer')"
            class="tm-members-bottom"/>
        </BCol>
        <BCol class="tm-view" cols="9">
          <!-- ADD PROPER MEMBER -->
          <component :is="switchView()" :playerRole="'Pioneer'"></component>
        </BCol>
        <button class="tm-close-button" @click="closeModal">Close</button>
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
    this.$root.$on('openTrading', (data: string) => {
      this.setStyle = '';
    });
  }

  closeModal(): void {
    this.setStyle = 'none';
  }

  switchView(): any {
    // Note: need to adjust return type
    return (this.activeView === 'request' ? 'TradeRequest' : 'TradeIncoming');
  }

  setActiveTab(activeTab: string): string {
    return (this.activeView === activeTab ? 'active' : '');
  }

  setView(view: string): void {
    if (view === 'request') {
      this.$store.dispatch('setTradingView', 'request');
    }
    if (view === 'incoming') {
      this.$store.dispatch('setTradingView', 'incoming');
    }
    // Note: add additional view as necessary
  }

  setActiveMember(member: string): string {
    return (this.activeMember === member ? 'active' : '');
  }
}
</script>

<style scoped>

.tm-transparent-wrapper {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(30, 34, 35, 0.8);
}

.tm-wrapper {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tm-tabs {
  height: 3rem;
  width: 60rem;
  border-left: 0.125rem solid #F5F5F5;
  border-bottom: 0.125rem solid #F5F5F5;
}

.tm-tabs-tab {
  height: 100%;
  width: 12rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 0.125rem solid #F5F5F5;
  border-top: 0.125rem solid #F5F5F5;
  color: #F5F5F5;
  background-color: #1E2223;
  cursor: pointer;
}

.tm-tabs-tab p {
  margin: 0;
}

.tm {
  position: relative;
  height: 35rem;
  width: 60rem;
  margin: 0;
  padding: 0;
  border: 0.125rem solid #F5F5F5;
  border-top: none;
  border-radius: 0 0 1.25rem 1.25rem;
  background-color: #1e2223;
}

.tm-members {
  height: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 0.125rem solid #F5F5F5;
}

.tm-members-bottom {
  border-bottom-left-radius: 1.25rem;
}

.tm-members-seperator {
  border-bottom: 0.125rem solid #F5F5F5;
}

.tm-view {
  height: 100%;
  padding: 0;
}

.tm-close-button {
  position: absolute;
  z-index: 2;
  top: 2rem;
  right: 2rem;
  border: none;
  text-decoration: underline;
  color: #F5F5F5;
  background: none;
}

.tm-close-button:hover {
  color: #c67b5c;
}

.tm-close-button:active {
  outline: none;
}

.active {
  color: #1E2223 !important;
  background-color: #c67b5c !important;
}
</style>
