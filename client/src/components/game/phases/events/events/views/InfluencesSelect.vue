<template>
  <div class="event-select-resources">
    <div class="wrapper">
      <div class="topbar">
        <p class="title">Resources you can save</p>

        <DiscreteStatusBar
          class="discrete-bar"
          :usedTimeBlocks="remainingTime"
          :totalTimeBlocks="timeBlockTotal"
        />

        <p class="status">[ {{ remainingTime }} ]</p>
      </div>

      <div class="cards">
        <CardInvestment class="card"
          v-for="investment in investments"
          v-bind="investment"
          :key="investment.name"
          @input="setInvestmentAmount"
        />
      </div>
    </div>
  </div>
</template>



<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import {Resource, ResourceAmountData, RESOURCES, INVESTMENTS, ResourceCostData, Investment } from "@port-of-mars/shared/types";
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import DiscreteStatusBar from '@port-of-mars/client/components/game/phases/investment/DiscreteStatusBar.vue';
import CardInvestment from '@port-of-mars/client/components/game/phases/investment/CardInvestment.vue';
import * as _ from 'lodash';

@Component({
  components: {
    DiscreteStatusBar,
    CardInvestment
  }
})
export default class InfluencesSelect extends Vue {
  private origPending = _.cloneDeep(this.$tstore.getters.player.pendingInvestments);

  get investments(): any {
    const p = this.$tstore.getters.player
    return Object.keys(this.origPending).map((investment) => {
      return {
        name:investment,
        cost: this.origPending[investment as Investment] < 0 ? 1 : Number.MAX_SAFE_INTEGER,
        pendingInvestment: p.pendingInvestments[investment as Investment],
      }
    });
  }

  get remainingTime() {
    const p = this.$tstore.getters.player;
    const pendingInvestments = p.pendingInvestments;
    return this.getRemainingTimeBlocks(pendingInvestments);
  }

  private getRemainingTimeBlocks(pendingInvestment: ResourceCostData) {
    const timeBlocks = this.$tstore.getters.player.timeBlocks;
    return (
      timeBlocks -
      _.reduce(INVESTMENTS,(tot, investment) =>
          tot + (this.origPending[investment]*-1 - pendingInvestment[investment]*-1),
        0)
    );

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
      msg.units >=  this.origPending[msg.name] &&
      this.getRemainingTimeBlocks(pendingInvestments) >= 0
    ) {
      this.$tstore.commit('SET_PENDING_INVESTMENT_AMOUNT', {
        investment: msg.name,
        units: msg.units,
        role: this.$tstore.state.role
      });
    }
  }

    get timeBlockTotal() {
    return this.$store.getters.player.timeBlocks;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/events/events/views/InfluencesSelect.scss';
</style>
