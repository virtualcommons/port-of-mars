<template>
  <div class="c-investments container tour-invest-action">
    <div class="wrapper row">
      <div class="timeblock-investments col-8 tour-invest">
        <div class="topbar tour-time-blocks">
          <p class="title">Time Blocks</p>
          <TimeBlockMeter
            class="timeblockmeter"
            :usedTimeBlocks="remainingTimeBlocks"
            :totalTimeBlocks="timeBlockTotal"
          />
          <p class="status">{{ remainingTimeBlocks }}</p>
          <b-icon-clock-fill scale="1.3" class="m-2"></b-icon-clock-fill>
        </div>

        <div class="cards">
          <InvestmentCard
            v-for="cost in costs"
            v-bind="cost"
            :key="cost.name"
            @input="setInvestmentAmount"
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
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';
import {
  INVESTMENTS,
  InvestmentData,
  Resource,
  ResourceCostData,
  AccomplishmentData,
  Role,
} from '@port-of-mars/shared/types';
import { AbstractGameAPI } from '@port-of-mars/client/api/game/types';
import TimeBlockMeter from './investment/TimeBlockMeter.vue';
import InvestmentCard from './investment/InvestmentCard.vue';
import { canPurchaseAccomplishment } from '@port-of-mars/shared/validation';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import _ from 'lodash';
import { PlayerClientData, defaultPendingInvestment, ROLE_TO_INVESTMENT_DATA } from '@port-of-mars/shared/game/client/state';

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

  created() {
    this.api.resetPendingInvestments();
  }

  destroyed() {
    this.api.resetPendingInvestments();
  }

  get pendingInvestments(): InvestmentData {
    return this.$tstore.getters.player.pendingInvestments;
  }

  get player(): PlayerClientData {
    return this.$tstore.getters.player;
  }

  get activeAccomplishments() {
    return this.$tstore.getters.player.accomplishments.purchasable;
  }

  get purchasedAccomplishments() {
    return this.$tstore.getters.player.accomplishments.purchased;
  }

  get costs(): any {
    const p = this.$tstore.getters.player;
    const investmentCosts = ROLE_TO_INVESTMENT_DATA[p.role].map(
      name => ({ name, cost: p.costs[name], pendingInvestment: this.pendingInvestments[name]})
      );
    return investmentCosts;
  }

  get remainingTimeBlocks() {
    return this.getRemainingTimeBlocks(this.pendingInvestments);
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

  private setInvestmentAmount(msg: {
    name: Resource;
    units: number;
    cost: number;
  }) {
    const pendingInvestments = _.clone(this.pendingInvestments);
    pendingInvestments[msg.name] = msg.units;
    if (msg.units >= 0 && this.getRemainingTimeBlocks(pendingInvestments) >= 0) {
      const data = {
        investment: msg.name,
        units: msg.units,
        role: this.$tstore.state.role,
      };
      this.api.investPendingTimeBlocks(data);
    }
  }

  get timeBlockTotal() {
    return this.$store.getters.player.timeBlocks;
  }

  get purchasableAccomplishments() {
    return this.$store.getters.player.accomplishments.purchasable
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
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/Investments.scss';
</style>
