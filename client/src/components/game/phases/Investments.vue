<template>
  <b-row class="h-100 w-100 p-0 m-0 tour-invest-action">
    <!-- invest -->
    <b-col cols="8" class="d-flex flex-column h-100 w-100 light-shade-25-partition">
      <!-- timeblocks header -->
      <b-row class="h-auto w-100 mx-auto p-3 tour-time-blocks header">
        <p class="mx-2 my-auto">Time Blocks</p>
        <TimeBlockMeter
          :totalTimeBlocks="totalTimeBlocks"
          :usedTimeBlocks="remainingTimeBlocks"
          class="meter my-auto"
        />
        <span class="mx-2 my-auto"
          >{{ remainingTimeBlocks }}
          <b-icon-clock-fill class="mx-2" scale="1.3"></b-icon-clock-fill>
        </span>
      </b-row>
      <!-- influences -->
      <!-- Investment cards are not nested in a b-col because we want to
      align cards in a row, not column -->
      <b-row align-h="around" class="flex-grow-1 w-100 mx-auto my-3 p-2 tour-invest backdrop">
        <InvestmentCard
          v-for="investment in investments"
          :key="investment.name"
          v-bind="investment"
          @update="investTimeBlocks"
          :remainingTimeBlocks="remainingTimeBlocks"
          class="my-1"
        ></InvestmentCard>
      </b-row>
    </b-col>
    <!-- purchasable accomplishments -->
    <b-col cols="4" class="d-flex flex-column h-100 w-100">
      <!-- header -->
      <b-row class="h-auto w-100 mx-auto p-3 justify-content-center header">
        <p class="mx-2 my-auto">Accomplishments</p>
      </b-row>
      <!-- accomplishments -->
      <b-row class="flex-grow-1 w-100 mx-auto my-3 p-2 backdrop">
        <b-col>
          <div class="h-100 p-2 scrollable">
            <AccomplishmentCard
              v-for="accomplishment in purchasableAccomplishments"
              :key="accomplishment.label + Math.random()"
              :accomplishment="accomplishment"
            ></AccomplishmentCard>
          </div>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue } from "vue-property-decorator";
import {
  AccomplishmentData,
  InvestmentData,
  INVESTMENTS,
  Resource,
  ResourceCostData,
  Role
} from "@port-of-mars/shared/types";
import { AbstractGameAPI } from "@port-of-mars/client/api/game/types";
import TimeBlockMeter from "./investment/TimeBlockMeter.vue";
import InvestmentCard from "./investment/InvestmentCard.vue";
import { canPurchaseAccomplishment } from "@port-of-mars/shared/validation";
import AccomplishmentCard from "@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue";
import _ from "lodash";
import { PlayerClientData, ROLE_TO_INVESTMENT_DATA } from "@port-of-mars/shared/game/client/state";

@Component({
  components: {
    TimeBlockMeter,
    InvestmentCard,
    AccomplishmentCard
  }
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
  get investments(): any {
    const p = this.$tstore.getters.player;

    console.log(
      ROLE_TO_INVESTMENT_DATA[p.role].map(name => ({
        name,
        cost: p.costs[name],
        pendingInvestment: this.pendingInvestments[name]
      }))
    );
    // get influence costs base on local player's role
    return ROLE_TO_INVESTMENT_DATA[p.role].map(name => ({
      name,
      cost: p.costs[name],
      pendingInvestment: this.pendingInvestments[name]
    }));
  }

  /**
   * Sort available accomplishments by purchasable first.
   */
  get purchasableAccomplishments(): Array<AccomplishmentData> {
    return this.activeAccomplishments
      .slice()
      .sort((a: AccomplishmentData, b: AccomplishmentData) => {
        return (
          Number(canPurchaseAccomplishment(b, this.$tstore.getters.player.inventory)) -
          Number(canPurchaseAccomplishment(a, this.$tstore.getters.player.inventory))
        );
      });
  }

  /**
   * Get local player's total time blocks.
   */
  get totalTimeBlocks(): number {
    return this.$tstore.getters.player.timeBlocks;
  }

  /**
   * Get local player's costs for influences.
   */
  get remainingTimeBlocks(): number {
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
    const difference =
      timeBlocks -
      _.reduce(
        INVESTMENTS,
        (tot, investment) => tot + pendingInvestments[investment] * costs[investment],
        0
      );
    return difference;
  }

  /**
   * Invest time blocks into a resource.
   * @param investment Time block investment into a resource.
   */
  investTimeBlocks(investment: { name: Resource; units: number; cost: number }) {
    const pendingInvestments = _.clone(this.pendingInvestments);
    pendingInvestments[investment.name] = investment.units;
    if (investment.units >= 0 && this.calculateRemainingTimeBlocks(pendingInvestments) >= 0) {
      const data = {
        investment: investment.name,
        units: pendingInvestments[investment.name],
        role: this.$tstore.state.role
      };
      this.api.investPendingTimeBlocks(data);
    }
  }
}
</script>

<style lang="scss">
.meter {
  flex: 1;
  overflow-x: hidden;
}
</style>
