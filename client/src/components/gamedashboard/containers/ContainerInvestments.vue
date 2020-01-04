<template>
  <div class="container-investments">
    <div class="topbar">
      <p class="title">Time Investments</p>
      <StatusBar
        class="statusbar"
        :setWidth="`${remainingTimeBlocks * 10}`"
        :colorOuter="'statusbar-outer-gray'"
        :colorInner="'statusbar-inner-gray'"
      />
      <p class="status">{{ remainingTimeBlocks }}</p>
    </div>

    <div class="cards">
      <CardInvestment
        v-for="cost in costs"
        v-bind="cost"
        :key="cost.name"
        @input="setInvestmentAmount"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import StatusBar from '@/components/gamedashboard/StatusBar.vue';
import CardInvestment from '@/components/gamedashboard/cards/CardInvestment.vue';
import {
  InvestmentData,
  INVESTMENTS,
  Resource,
  ResourceAmountData,
  ResourceCostData,
  Role
} from 'shared/types';
import * as _ from 'lodash';

@Component({
  components: {
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
        prev.push({ name, cost, pendingInvestment });
        return prev;
      }, [] as Array<{ name: string; cost: number; pendingInvestment: number }>)
      .sort((a, b) => a.cost - b.cost);

    return investmentData;
  }

  get remainingTimeBlocks() {
    const p = this.$tstore.getters.player;
    const pendingInvestments = p.pendingInvestments;
    return this.getRemainingTimeBlocks(pendingInvestments);
  }

  getRemainingTimeBlocks(pendingInvestments: ResourceCostData) {
    const p = this.$tstore.getters.player;
    const timeBlocks = p.timeBlocks;
    const costs = p.costs;
    return (
      timeBlocks -
      _.reduce(
        INVESTMENTS,
        (tot, investment) => tot + pendingInvestments[investment] * costs[investment],
        0
      )
    );
  }

  setInvestmentAmount(msg: { name: Resource; units: number; cost: number }) {
    const pendingInvestments = _.clone(this.$tstore.getters.player.pendingInvestments);
    pendingInvestments[msg.name] = msg.units;
    if (msg.units >= 0 && this.getRemainingTimeBlocks(pendingInvestments) >= 0) {
      this.$tstore.commit('SET_PENDING_INVESTMENT_AMOUNT', {
        investment: msg.name,
        units: msg.units,
        role: this.$tstore.state.role
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/containers/ContainerInvestments.scss';
</style>
