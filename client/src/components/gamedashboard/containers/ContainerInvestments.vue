<template>
  <BContainer class="container-investments">
    <BRow class="investments-topbar v-step-10">
      <p class="investments-topbar-title">Time Investments</p>
      <StatusBar
        class="investments-topbar-statusbar"
        :setWidth="`${remainingTimeBlocks * 10}`"
        :colorOuter="'statusbar-outer-gray'"
        :colorInner="'statusbar-inner-gray'"
      />
      <p class="investments-topbar-status">( {{ remainingTimeBlocks }} )</p>
    </BRow>

    <BRow class="investments-cards v-step-11 v-step-12">
      <BRow class="investments-cards-top">
        <CardInvestment v-bind="costs[2]" class="v-step-13" />
        <CardInvestment v-bind="costs[3]" />
        <CardInvestment v-bind="costs[0]" />
      </BRow>

      <BRow class="investments-cards-bottom">
        <CardInvestment v-bind="costs[4]" />
        <CardInvestment v-bind="costs[5]" />
        <CardInvestment v-bind="costs[1]" />
      </BRow>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import StatusBar from '@/components/gamedashboard/StatusBar.vue';
import CardInvestment from '@/components/gamedashboard/cards/CardInvestment.vue';
import {InvestmentData, INVESTMENTS, Resource, ResourceCostData, Role} from "shared/types";
import * as _ from 'lodash';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    StatusBar,
    CardInvestment
  }
})
export default class ContainerInvestments extends Vue {
  get costs(): any {
    const p = this.$tstore.getters.player;
    const investmentData = Object.keys(p.costs)
      .reduce((prev, name) => {
        const k: keyof ResourceCostData = name as keyof ResourceCostData;
        const cost = p.costs[k];
        let pendingInvestment: number;
        pendingInvestment = p.pendingInvestments[k];
        prev.push({name, cost, pendingInvestment});
        return prev;
      }, [] as Array<{ name: string, cost: number, pendingInvestment: number}>).sort((a, b) => a.cost - b.cost);

    return investmentData;
  }

  get remainingTimeBlocks() {
    const p = this.$tstore.getters.player;
    const timeBlocks = p.timeBlocks;
    const costs = p.costs;
    const pendingInvestments = p.pendingInvestments;
    return timeBlocks - _.reduce(INVESTMENTS, (tot, investment) => tot + pendingInvestments[investment]*costs[investment], 0)
  }
}
</script>

<style scoped>
.container-investments {
  height: 100%;
  width: 100%;
  max-width: none;
  padding: 0.5rem;
  padding-right: 0.25rem;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.investments-topbar {
  height: 10%;
  width: 100%;
  margin: 0;
  margin-bottom: 0.5rem;
  padding: 0.25rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--space-orange);
}

.investments-topbar-title {
  margin: 0;
  font-size: var(--font-med);
  color: var(--space-gray);
}

.investments-topbar-statusbar {
  margin: 0 1rem;
  flex: 1;
}

.investments-topbar-status {
  margin: 0;
  font-size: var(--font-med);
  color: var(--space-gray);
}

.investments-cards {
  height: 90%;
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--space-white-opaque-1);
}

.investments-cards-top,
.investments-cards-bottom {
  height: 50%;
  width: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* background-color: var(--space-white-opaque-1); */
}
</style>
