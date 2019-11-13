<template>
  <div class="pm-transparent-wrapper" :style="{ display: setStyle }">
    <BContainer class="pm-wrapper">
      <BRow class="pm-tabs">
        <div class="pm-tabs-tab">
          <p>Tab One</p>
        </div>
        <div class="pm-tabs-tab">
          <p>Tab Two</p>
        </div>
      </BRow>
      <BRow class="pm">
        <BCol class="pm-view" cols="9">
          <!-- <component :is="switchView()"></component> -->
        </BCol>
        <button class="pm-close-button" @click="closeModal">Close</button>
      </BRow>
    </BContainer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
  },
})
export default class ProfileModal extends Vue {
  setStyle: string = 'none';

  mounted() {
    this.$root.$on('openProfile', (data: string) => {
      this.setStyle = '';
    });
  }

  closeModal(): void {
    this.setStyle = 'none';
  }

  // switchView(): any {
  //   // Note: need to adjust return type
  //   return (this.activeView === 'request' ? 'TradeRequest' : 'TradeIncoming');
  // }

  // setActiveTab(activeTab: string): string {
  //   return (this.activeView === activeTab ? 'active' : '');
  // }

  // setView(view: string): void {
  //   if (view === 'request') {
  //     this.$store.dispatch('setTradingView', 'request');
  //   }
  //   if (view === 'incoming') {
  //     this.$store.dispatch('setTradingView', 'incoming');
  //   }
  //   // Note: add additional view as necessary
  // }
}
</script>

<style scoped>
.pm-transparent-wrapper {
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

.pm-wrapper {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.pm-tabs {
  height: 3rem;
  width: 60rem;
  border-left: var(--border-white);
  border-bottom: var(--border-white);
}

.pm-tabs-tab {
  height: 100%;
  width: 12rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: var(--border-white);
  border-top: var(--border-white);
  color: var(--space-white);
  background-color: var(--space-gray);
  cursor: pointer;
}

.pm-tabs-tab p {
  margin: 0;
}

.pm {
  position: relative;
  height: 35rem;
  width: 60rem;
  margin: 0;
  padding: 0;
  border: var(--border-white);
  border-top: none;
  border-radius: 0 0 1.25rem 1.25rem;
  background-color: var(--space-gray);
}

.pm-view {
  height: 100%;
  padding: 0;
}

.pm-close-button {
  position: absolute;
  z-index: 2;
  top: 2rem;
  right: 2rem;
  border: none;
  text-decoration: underline;
  color: var(--space-white);
  background: none;
}

.pm-close-button:hover {
  color: var(--space-orange);
}

.pm-close-button:active {
  outline: none;
}

.active {
  color: var(--space-gray) !important;
  background-color: var(--space-orange) !important;
}
</style>
