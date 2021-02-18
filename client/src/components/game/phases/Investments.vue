<template>
  <b-container class="h-100 w-auto p-0 m-0 tour-invest-action" fluid>
    <b-row class="h-100 w-auto flex-shrink-1">
      <b-col class="h-100 w-auto partition" cols="8">
        <b-row class="header-banner mx-auto flex-shrink-1">
          <p class="my-auto mx-2">Time Blocks</p>
          <TimeBlockMeter
            :totalTimeBlocks="totalTimeBlocks"
            :usedTimeBlocks="remainingTimeBlocks"
            class="meter my-auto"
          />
          <span class="my-auto mx-2">{{ remainingTimeBlocks }}
            <b-icon-clock-fill class="mx-2" scale="1.3"></b-icon-clock-fill>
          </span>
        </b-row>
        <b-row class="content-wrapper p-3 mt-3 mx-auto flex-shrink-1">
          <InvestmentCard
            v-for="cost in costs"
            :key="cost.name"
            v-bind="cost"
            @input="investTimeBlocks"
          />
        </b-row>
      </b-col>
      <b-col class="h-100 w-auto tour-accomplishments" cols="4">
        <b-row class="header-banner mx-auto flex-shrink-1">
          <p class="m-auto">Purchasable Accomplishments</p>
        </b-row>
        <b-row class="mx-auto mt-3 p-3 content-wrapper" fluid>
          <AccomplishmentCard
            v-for="accomplishment in purchasableAccomplishments"
            :key="accomplishment.label + Math.random()"
            :accomplishment="accomplishment"
          />
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {Component, Inject, Prop, Vue} from 'vue-property-decorator';
import {
  AccomplishmentData,
  InvestmentData,
  INVESTMENTS,
  Resource,
  ResourceCostData,
  Role,
} from '@port-of-mars/shared/types';
import {AbstractGameAPI} from '@port-of-mars/client/api/game/types';
import TimeBlockMeter from './investment/TimeBlockMeter.vue';
import InvestmentCard from './investment/InvestmentCard.vue';
import {canPurchaseAccomplishment} from '@port-of-mars/shared/validation';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import _ from 'lodash';
import {PlayerClientData, ROLE_TO_INVESTMENT_DATA} from '@port-of-mars/shared/game/client/state';

@Component({
  components: {
    TimeBlockMeter,
    InvestmentCard,
    AccomplishmentCard,
  },
})
export default class Investments extends Vue {
  @Inject() readonly api!: AbstractGameAPI;

  @Prop() role!: Role;

  // called synchronously after Vue instance created

  /**
   * Get local player's pending investments in
   * system health, science, government, legacy, culture, finance
   */
  get pendingInvestments(): InvestmentData {
    return this.$tstore.getters.player.pendingInvestments;
  }

  // called after Vue instance destroyed
  // all directives of the Vue instance have been unbound,

  /**
   * Get local player.
   */
  get player(): PlayerClientData {
    return this.$tstore.getters.player;
  }

  /**
   * Get local player's available accomplishments for a given round.
   */
  get activeAccomplishments(): Array<AccomplishmentData> {
    return this.$tstore.getters.player.accomplishments.purchasable;
  }

  /**
   * Get local player's purchased accomplishments.
   */
  get purchasedAccomplishments() {
    return this.$tstore.getters.player.accomplishments.purchased;
  }

  /**
   * Get local player's costs for influences.
   */
  get costs(): any {
    const p = this.$tstore.getters.player;

    // get influence costs base on local player's role
    return ROLE_TO_INVESTMENT_DATA[p.role].map(
      name => ({name, cost: p.costs[name], pendingInvestment: this.pendingInvestments[name]})
    );
  }

  /**
   * Sort available accomplishments by purchasable first.
   */
  get purchasableAccomplishments(): Array<AccomplishmentData> {
    return this.activeAccomplishments
      .slice()
      .sort((a: AccomplishmentData, b: AccomplishmentData) => {
        return (
          Number(
            canPurchaseAccomplishment(b, this.$store.getters.player.inventory)
          ) -
          Number(
            canPurchaseAccomplishment(a, this.$store.getters.player.inventory)
          )
        );
      });
  }

  /**
   * Get local player's total time blocks.
   */
  get totalTimeBlocks() {
    return this.$store.getters.player.timeBlocks;
  }

  /**
   * Get local player's costs for influences.
   */
  get remainingTimeBlocks() {
    return this.calculateRemainingTimeBlocks(this.pendingInvestments);
  }

  // available: data observation, computed properties, methods, watch/event callbacks
  created() {
    // reset pending investments to 0
    this.api.resetPendingInvestments();
  }

  // all event listeners have been removed, and all child Vue instances have also been destroyed
  destroyed() {
    this.api.resetPendingInvestments();
  }

  /**
   * Remaining time blocks = (Total time block available) - (Local player's current
   * investments for each influence)
   * @param pendingInvestments Cost of eac influence
   */
  calculateRemainingTimeBlocks(pendingInvestments: ResourceCostData): number {
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

  /**
   * Invest time blocks into a resource.
   * @param investment Time block investment into a resource.
   */
  investTimeBlocks(investment: {
    name: Resource;
    units: number;
    cost: number;
  }) {
    const pendingInvestments = _.clone(this.pendingInvestments);
    pendingInvestments[investment.name] = investment.units;
    if (investment.units >= 0 && this.calculateRemainingTimeBlocks(pendingInvestments) >= 0) {
      const data = {
        investment: investment.name,
        units: investment.units,
        role: this.$tstore.state.role,
      };
      this.api.investPendingTimeBlocks(data);
    }
  }
}
</script>

<style lang="scss">
.header-banner {
  background-color: $phase-topbar-background;
  height: 10%;
  color: $dark-shade;
}

.meter {
  flex: 1;
  overflow-x: hidden;
}

.partition {
  border-right: .2rem solid;
  border-color: $light-shade-25;
}

.content-wrapper {
  background-color: $light-shade-05;
  height: 85%;
  overflow-y: scroll;
  overflow-x: hidden;
}

.header-text {
  color: $dark-shade;
}
</style>
