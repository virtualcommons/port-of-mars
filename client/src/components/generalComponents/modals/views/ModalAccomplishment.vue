<template>
  <div class="modal-accomplishment">
    <p class="title">{{ cardData.label }}</p>
    <p class="info">{{ cardData.flavorText }}</p>
    <div class="investments">
      <div
        v-for="(investment, i) in accomplishmentCost"
        :key="investment + Math.random()"
        :class="{ 'unattainable-resource': investmentGrayStatus[i] }"
        class="container"
      >
        <img
          :src="require(`@port-of-mars/client/assets/icons/${investment}.svg`)"
          alt="Investment"
        />
      </div>
    </div>
    <p class="cost">Cost</p>
    <p class="purchase-button">
      {{ purchaseText }}
    </p>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  InjectReactive,
  Inject
} from 'vue-property-decorator';
import { canPurchaseAccomplishment } from '@port-of-mars/shared/validation';
import {
  AccomplishmentData,
  Investment,
  INVESTMENTS,
  Resource,
  RESOURCES
} from '@port-of-mars/shared/types';
import * as _ from 'lodash';

@Component({})
export default class ModalAccomplishment extends Vue {
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
  private cardData!: AccomplishmentData;

  get accomplishmentCost(): Array<Investment> {
    return INVESTMENTS.filter(
      investment => this.cardData[investment] !== 0
    ).flatMap(investment =>
      _.fill(Array(Math.abs(this.cardData[investment])), investment)
    );
  }

  get canPurchase() {
    return canPurchaseAccomplishment(this.cardData, this.playerFullInventory);
  }

  get playerFullInventory() {
    let totalInventory = _.clone(this.$tstore.getters.player.inventory);
    const pendingInventory = this.$tstore.getters.player.pendingInvestments;

    for (const resource of RESOURCES) {
      totalInventory[resource] += pendingInventory[resource];
    }

    return totalInventory;
  }

  get investmentGrayStatus() {
    let grayStatus = [];
    let inventory = _.clone(this.playerFullInventory);
    for (let investment of this.accomplishmentCost) {
      if (investment === 'upkeep') {
        grayStatus.push(false);
      } else if (inventory[investment] > 0) {
        grayStatus.push(false);
        inventory[investment]--;
      } else {
        grayStatus.push(true);
      }
    }
    return grayStatus;
  }

  get purchaseText() {
    const b = this.canPurchase;
    return b
      ? 'You have the resources to purchase this'
      : 'You cannot purchase this';
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/generalComponents/modals/views/ModalAccomplishment.scss';

// .unattainable-resource{
//   // Percentage produce 1% opacity in production for some reason
//   opacity: 0.3;
// }
</style>
