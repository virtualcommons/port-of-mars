<template>
  <BContainer class="container-trade">
    <BRow class="row-trade">
      <BCol class="trade-options" cols="3">
        <button
          type="button"
          name="button"
          @click="handleClick('incoming')"
          :class="currentView === 'incoming' ? 'btn-active' : ''"
        >
          Incoming Trades
        </button>
        <button
          type="button"
          name="button"
          @click="handleClick('request')"
          :class="currentView === 'request' ? 'btn-active' : ''"
        >
          Your Trades
        </button>
      </BCol>
      <BCol class="trade-incoming" v-if="currentView === 'incoming'">
        <div class="trade-incoming-list-wrapper">
          <div class="trade-incoming-list">
            <!-- need to refactor key -->
            <Trade v-for="trade in trades" v-bind="trade" :key="Math.random()" />
          </div>
        </div>
      </BCol>
      <BCol class="trade-request" v-if="currentView === 'request'">
        <div class="trade-request-list-wrapper">
          <div class="trade-request-list">
            <!-- need to refactor key -->
            <Trade v-for="trade in trades" v-bind="trade" :key="Math.random()" />
          </div>
        </div>
        <div class="trade-request-make">
          <TradeRequest />
        </div>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import Trade from '@/components/gamedashboard/Trade.vue';
import TradeRequest from '@/components/gamedashboard/TradeRequest.vue';
// import * as '_' from 'lodash';

@Component({
  components: {
    Trade,
    TradeRequest
  }
})
export default class ContainerTrade extends Vue {
  private currentView: string = 'incoming';

  get trades() {
    const tradeSet = this.$tstore.state.tradeSet;
    return Object.keys(tradeSet).map(id => ({
      id,
      from: tradeSet[id].from,
      to: tradeSet[id].to
    }))
  }

  // get incomingTrades() {}
  //
  // get sentTrades() {}

  private tradeOne: object = {
    id: 1234,
    from: {
      role: 'Curator',
      resourceAmount: {
        science: 1,
        government: 1,
        legacy: 1,
        finance: 1,
        culture: 1
      }
    },
    to: {
      role: 'Researcher',
      resourceAmount: {
        science: 1,
        government: 1,
        legacy: 1,
        finance: 1,
        culture: 1
      }
    }
  };

  private tradeTwo: object = {
    id: 123,
    from: {
      role: 'Curator',
      resourceAmount: {
        science: 1,
        government: 1,
        legacy: 1,
        finance: 1,
        culture: 1
      }
    },
    to: {
      role: 'Researcher',
      resourceAmount: {
        science: 1,
        government: 1,
        legacy: 1,
        finance: 1,
        culture: 1
      }
    }
  };

  private receivedTrades: Array<object> = [
    this.tradeOne,
    this.tradeOne,
    this.tradeOne,
    this.tradeOne,
    this.tradeOne,
    this.tradeOne,
    this.tradeOne,
    this.tradeOne,
    this.tradeOne,
    this.tradeOne,
    this.tradeOne,
    this.tradeOne,
    this.tradeOne,
    this.tradeOne,
    this.tradeOne
  ];

  private sentTrades: Array<object> = [
    this.tradeTwo,
    this.tradeTwo,
    this.tradeTwo,
    this.tradeTwo,
    this.tradeTwo,
    this.tradeTwo
  ];

  handleClick(view: string) {
    this.currentView = view;
  }
}
</script>

<style scoped>
.container-trade,
.row-trade {
  height: 100%;
  width: 100%;
  max-width: none;
  margin: 0;
}

.container-trade {
  padding: 0.5rem;
  color: var(--space-white);
}

.row-trade {
  display: flex;
  justify-content: center;
  align-items: center;
}

.trade-options {
  height: 100%;
  padding: 0;
  padding: 0.5rem;
  margin-right: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  background-color: var(--space-white-opaque-1);
}

.trade-options button {
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: none;
  color: var(--space-white);
  background-color: transparent;
  transition: all 0.2s ease-in-out;
}

.trade-options button:hover {
  color: var(--space-gray);
  background-color: var(--space-white);
}

.trade-options button:focus,
.trade-options button:active {
  outline: none;
}

.btn-active {
  color: var(--space-gray) !important;
  background-color: var(--space-white) !important;
}

.trade-incoming,
.trade-request {
  height: 100%;
  padding: 0;
  /* padding: 0.5rem; */
  /* background-color: var(--space-white-opaque-1); */
}

.trade-request {
  display: flex;
  flex-flow: column;
}

.trade-incoming-list-wrapper {
  height: 100%;
}

.trade-request-list-wrapper {
  height: 50%;
}

.trade-incoming-list-wrapper,
.trade-request-list-wrapper {
  width: 100%;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.trade-incoming-list-wrapper::-webkit-scrollbar,
.trade-request-list-wrapper::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}

.trade-incoming-list,
.trade-request-list {
  min-height: 100%;
  width: 100%;
}

.trade-incoming-list p,
.trade-request-list p {
  width: 100%;
  height: 4rem;
  margin-bottom: 0.5rem;
  background-color: var(--space-white-opaque-1);
}

.trade-incoming-list p:last-child,
.trade-request-list p:last-child {
  margin-bottom: 0;
}

.trade-request-make {
  width: 100%;
  margin-top: 0.5rem;
  flex-grow: 1;
}
</style>
