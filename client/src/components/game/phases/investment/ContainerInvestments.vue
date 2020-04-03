<template>
  <div class="container-investments tour-investments">
    <div class="wrapper">
      <div class="topbar">
        <p class="title">Time Blocks</p>

        <DiscreteStatusBar
          class="discrete-bar"
          :usedTimeBlocks="remainingTimeBlocks"
          :totalTimeBlocks="timeBlockTotal"
        />

        <p class="status">[ {{ remainingTimeBlocks }} ]</p>
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
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import { INVESTMENTS, Resource, ResourceCostData } from '@port-of-mars/shared/types';
import DiscreteStatusBar from './DiscreteStatusBar.vue';
import CardInvestment from './CardInvestment.vue';
import * as _ from 'lodash';
import { TutorialAPI } from '@port-of-mars/client/api/tutorial/request';

@Component({
  components: {
    DiscreteStatusBar,
    CardInvestment
  }
})
export default class ContainerBottom extends Vue {
  @Inject()
  readonly api!: TutorialAPI;

  get costs(): any {
    const p = this.$tstore.getters.player;
    const investmentData = Object.keys(p.costs)
      .reduce((prev, name) => {
        const k: keyof ResourceCostData = name as keyof ResourceCostData;
        const cost = p.costs[k];
        let pendingInvestment = p.pendingInvestments[k];
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

  private getRemainingTimeBlocks(pendingInvestments: ResourceCostData) {
    const p = this.$tstore.getters.player;
    const timeBlocks = p.timeBlocks;
    const costs = p.costs;
    return (
      timeBlocks -
      _.reduce(
        INVESTMENTS,
        (tot, investment) =>
          tot + pendingInvestments[investment] * costs[investment],
        0
      )
    );
  }

  get isInTutorial(){
    return this.$tstore.getters.layout === 'tutorial';
  }

  private setInvestmentAmount(msg: {
    name: Resource;
    units: number;
    cost: number;
  }) {
    const pendingInvestments = _.clone(
      this.$tstore.getters.player.pendingInvestments
    );
    pendingInvestments[msg.name] = msg.units;
    if (
      msg.units >= 0 &&
      this.getRemainingTimeBlocks(pendingInvestments) >= 0
    ) {
      this.$tstore.commit('SET_PENDING_INVESTMENT_AMOUNT', {
        investment: msg.name,
        units: msg.units,
        role: this.$tstore.state.role
      });
    }

    if(this.isInTutorial){
      this.api.investTimeBlocks();
    }
  }

  get timeBlockTotal() {
    return this.$store.getters.player.timeBlocks;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/investment/ContainerInvestments.scss';
</style>
