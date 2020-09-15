<template>
  <div class="c-investments container tour-invest-action">
    <div class="wrapper row">
      <div class="timeblock-investments col-8 tour-invest">
        <div class="topbar tour-time-blocks">
          <p class="title">Time Blocks</p>
          <TimeBlockMeter
            class="timeblockmeter"
            :usedTimeBlocks="remainingTimeBlocks"
            :totalTimeBlocks="totalTimeBlocks"
          />
          <p class="status">{{ remainingTimeBlocks }}</p>
          <b-icon-clock-fill scale="1.3" class="m-2"></b-icon-clock-fill>
        </div>

        <div class="cards">
          <InvestmentCard
            v-for="cost in costs"
            v-bind="cost"
            :key="cost.name"
            @input="investTimeBlocks"
          />
        </div>
      </div>
      <div class="purchasable-accomplishments col-4 tour-accomplishments">
        <div class="topbar">
          <p class="title">Purchasable Accomplishments</p>
        </div>
        <div class="outer-wrapper">
          <div class="wrapper">
            <AccomplishmentCard
              v-for="accomplishment in purchasableAccomplishments"
              :accomplishment="accomplishment"
              :key="accomplishment.label + Math.random()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
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
  // available: data observation, computed properties, methods, watch/event callbacks
  created() {
    // reset pending investments to 0
    this.api.resetPendingInvestments();
  }

  // called after Vue instance destroyed
  // all directives of the Vue instance have been unbound,
  // all event listeners have been removed, and all child Vue instances have also been destroyed
  destroyed() {
    this.api.resetPendingInvestments();
  }

  /**
   * Get local player's pending investments in
   * system health, science, government, legacy, culture, finance
   */
  get pendingInvestments(): InvestmentData {
    return this.$tstore.getters.player.pendingInvestments;
  }

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

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/Investments.scss';
</style>
