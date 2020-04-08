<template>
  <div class="c-investments tour-investments container">
    <div class="wrapper row">
      <div class="timeblockinvestments col-8">
        <div class="topbar tour-time-blocks">
          <p class="title">Time Blocks</p>
          <TimeBlockMeter
            class="timeblockmeter"
            :usedTimeBlocks="remainingTimeBlocks"
            :totalTimeBlocks="timeBlockTotal"
          />
          <p class="status">{{ remainingTimeBlocks }}</p>
          <font-awesome-icon :icon="['fas', 'clock']" size="lg" class="icon" />
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
      <!-- <div class="action-container">
<div class="cards">
<CardInvestment
v-for="cost in costs"
v-bind="cost"
:key="cost.name"
@input="setInvestmentAmount"
/>
</div>
<div class="player-accomplishments tour-accomplishments">
<h4 class="header-text">Accomplishments</h4>
<div class="accomplishment-wrapper">
<div class="active">
<p class="active-text">Active</p>
<ContainerAccomplishmentsGeneral
:accomplishmentSet="activeAccomplishments"
:isVisible="true"
/>
</div>
<div class="purchased">
<p class="purchased-text">Purchased</p>
<ContainerAccomplishmentsGeneral
:accomplishmentSet="purchasedAccomplishments"
:isVisible="true"
/>
</div> -->
      <div class="purchasableaccomplishments col-4 tour-accomplishments">
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
  Resource,
  ResourceCostData,
  AccomplishmentData,
  Role,
} from '@port-of-mars/shared/types';
import { TutorialAPI } from '@port-of-mars/client/api/tutorial/request';
import TimeBlockMeter from './investment/TimeBlockMeter.vue';
import CardInvestment from './investment/CardInvestment.vue';
import { canPurchaseAccomplishment } from '@port-of-mars/shared/validation';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
// import ContainerAccomplishmentsGeneral from "@port-of-mars/client/components/game/accomplishments/ContainerAccomplishmentsGeneral.vue";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import * as _ from 'lodash';

library.add(faClock);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {
    TimeBlockMeter,
    CardInvestment,
    AccomplishmentCard,
  },
})
export default class Investments extends Vue {
  @Inject() readonly api!: TutorialAPI;

  @Prop() role!: Role;

  get activeAccomplishments() {
    return this.$tstore.getters.player.accomplishments.purchasable;
  }

  get purchasedAccomplishments() {
    return this.$tstore.getters.player.accomplishments.purchased;
  }

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

  get isInTutorial() {
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
        role: this.$tstore.state.role,
      });
    }

    if (this.isInTutorial) {
      this.api.investTimeBlocks();
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
