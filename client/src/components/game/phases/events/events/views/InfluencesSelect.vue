<template>
  <b-container fluid class="align-items-stretch">
    <b-row class="justify-content-center my-2">
      <p v-if="remainingTime > 0">Save 2 units of influence that you already own.</p>
      <p v-else>You have saved 2 units of influence.</p>
    </b-row>

    <b-row>
        <div class="h-100 w-100 px-1 timeblocks">
          <TimeBlockMeter :totalTimeBlocks="timeBlockTotal"
                          :usedTimeBlocks="remainingTime"
                          class="flex-grow-1"
          />
          <p class="m-1 status"><strong>{{ remainingTime }}</strong></p>
          <b-icon-briefcase-fill scale="1.3" class="m-2"></b-icon-briefcase-fill>
        </div>
      </b-row>
      <b-row v-if="investments.length > 0" class="py-3">
        <InvestmentCard
          v-for="investment in investments"
          :key="investment.name"
          v-bind="investment"
          class="card"
          @input="setInvestmentAmount"
        />
      </b-row>
      <b-row v-else class="cards justify-content-center">
        <p>
          You have no resources to save. Please press Ready to Advance.
        </p>
      </b-row>
  </b-container>
</template>

<script lang="ts">
import {Component, Inject, Vue} from 'vue-property-decorator';
import {Resource, ResourceAmountData, RESOURCES,} from '@port-of-mars/shared/types';
import {GameRequestAPI} from '@port-of-mars/client/api/game/request';
import InvestmentCard from '@port-of-mars/client/components/game/phases/investment/InvestmentCard.vue';
import * as _ from 'lodash';
import TimeBlockMeter from "@port-of-mars/client/components/game/phases/investment/TimeBlockMeter.vue";

@Component({
  components: {
    TimeBlockMeter,
    InvestmentCard,
  },
})
export default class InfluencesSelect extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  get investments(): any {
    return RESOURCES
      .filter(resource => this.inventory[resource] !== 0)
      .map((resource) => {
        return {
          name: resource,
          cost: 1,
          pendingInvestment: this.localInventory[resource],
        };
      });
  }

  get inventory(): ResourceAmountData {
    return this.$tstore.getters.player.inventory;
  }

  get localInventory(): ResourceAmountData {
    return this.$tstore.getters.player.pendingInvestments;
  }

  get remainingTime() {
    return this.getRemainingTimeBlocks(this.localInventory);
  }

  get timeBlockTotal() {
    console.log('total: ', this.$tstore.getters.player.timeBlocks)
    return this.$tstore.getters.player.timeBlocks;
  }

  created() {
    this.api.resetPendingInvestments();
  }

  destroyed() {
    this.api.resetPendingInvestments();
  }

  getRemainingTimeBlocks(pendingInvestment: ResourceAmountData) {
    const timeBlocks = this.$tstore.getters.player.timeBlocks;
    console.log('remaining: ', timeBlocks - _.sum(Object.values(pendingInvestment)))
    return timeBlocks - _.sum(Object.values(pendingInvestment));
  }

  private setInvestmentAmount(msg: {
    name: Resource;
    units: number;
    cost: number;
  }) {
    const inventory = _.cloneDeep(this.localInventory);
    inventory[msg.name] = msg.units;

    const isAffordable =
      msg.units >= 0 &&
      msg.units <= this.inventory[msg.name] &&
      this.getRemainingTimeBlocks(inventory) >= 0;

    if (isAffordable) {
      this.api.investPendingTimeBlocks({
        investment: msg.name,
        units: msg.units,
        role: this.$tstore.state.role,
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/events/events/views/InfluencesSelect.scss';
</style>
