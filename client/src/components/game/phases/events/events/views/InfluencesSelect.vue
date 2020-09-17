<template>
  <div class="event-select-resources">
    <div class="wrapper">
      <div class="topbar">
        <p class="title"><strong>Directions: </strong>Save 2 units of influence</p>
      </div>

      <TimeBlockMeter></TimeBlockMeter>
      <div class="cards" v-if="investments.length > 0">
        <InvestmentCard
          class="card"
          v-for="investment in investments"
          v-bind="investment"
          :key="investment.name"
          @input="setInvestmentAmount"
        />
      </div>
      <div class="cards" v-else>
        <p>
          You have no resources to save. Please press Ready to Advance.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import {
  Resource,
  ResourceAmountData, RESOURCES,
} from '@port-of-mars/shared/types';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import InvestmentCard from '@port-of-mars/client/components/game/phases/investment/InvestmentCard.vue';
import * as _ from 'lodash';
import {defaultInventory} from "@port-of-mars/shared/game/client/state";
import TimeBlockMeter from "@port-of-mars/client/components/game/phases/investment/TimeBlockMeter.vue";

@Component({
  components: {
    TimeBlockMeter,
    InvestmentCard,
  },
})
export default class InfluencesSelect extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  created() {
    this.api.resetPendingInvestments();
  }

  destroyed() {
    this.api.resetPendingInvestments();
  }

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

  getRemainingTimeBlocks(pendingInvestment: ResourceAmountData) {
    const timeBlocks = this.$tstore.getters.player.timeBlocks;
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

  get timeBlockTotal() {
    return this.$store.getters.player.timeBlocks;
  }
}
</script>

<style lang="scss" scoped>
//@import '@port-of-mars/client/stylesheets/game/phases/events/events/views/InfluencesSelect.scss';
</style>
