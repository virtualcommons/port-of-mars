<template>
  <div
    class="card-accomplishment"
    @click="handleClick"
    v-bind:class="{ unpurchasable: !canPurchase, purchasable: canPurchase }"
  >
    <div class="title">
      <p>{{ accomplishment.label }}</p>
    </div>
    <div class="info">
      <div class="points">
        <p>Points</p>
        <p>{{ accomplishment.victoryPoints }}</p>
      </div>
      <div class="cost">
        <div
          v-for="(investment, i) in accomplishmentCost"
          :key="investment + Math.random()"
          :class="{ 'unattainable-resource': isUnattainable[i] }"
          class="container"
        >
          <img
            :src="require(`@port-of-mars/client/assets/icons/${investment}.svg`)"
            alt="Investment"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {
  AccomplishmentData,
  INVESTMENTS,
  Resource,
  ResourceAmountData,
  RESOURCES
} from '@port-of-mars/shared/types';
import { canPurchaseAccomplishment } from '@port-of-mars/shared/validation';
import * as _ from 'lodash';

@Component({})
export default class CardAccomplishment extends Vue {
  @Prop({
    default: () => ({
      id: undefined,
      role: undefined,
      label: undefined,
      flavorText: undefined,
      science: undefined,
      government: undefined,
      legacy: undefined,
      finance: undefined,
      culture: undefined,
      upkeep: undefined,
      victoryPoints: undefined,
      effect: undefined
    })
  })
  private accomplishment!: AccomplishmentData;

  get accomplishmentCost() {
    return INVESTMENTS.filter(
      investment => this.accomplishment[investment] !== 0
    ).flatMap(investment =>
      _.fill(Array(Math.abs(this.accomplishment[investment])), investment)
    );
  }

  private handleClick() {
    this.$root.$emit('openModalCard', {
      card: 'accomplishment',
      payload: this.accomplishment
    });
  }

  get playerFullInventory() {
    let totalInventory: ResourceAmountData = _.clone(
      this.$tstore.getters.player.inventory
    );
    const pendingInventory: ResourceAmountData = this.$tstore.getters.player
      .pendingInvestments;

    for (const r of RESOURCES) {
      totalInventory[r] += pendingInventory[r];
    }

    return totalInventory;
  }

  get canPurchase() {
    return canPurchaseAccomplishment(
      this.accomplishment,
      this.playerFullInventory
    );
  }

  get isUnattainable() {
    let grayStatus = [];
    for (let investment of this.accomplishmentCost) {
      if (investment === 'upkeep') {
        grayStatus.push(false);
      } else if (this.playerFullInventory[investment] > 0) {
        grayStatus.push(false);
        this.playerFullInventory[investment]--;
      } else {
        grayStatus.push(true);
      }
    }
    return grayStatus;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/accomplishments/CardAccomplishment.scss';
</style>
