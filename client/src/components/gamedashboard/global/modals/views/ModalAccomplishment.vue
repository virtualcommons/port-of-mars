<template>
  <div class="modal-accomplishment">
    <p class="title">{{ cardData.label }}</p>
    <p class="info">{{ cardData.flavorText }}</p>
    <div class="investments">
      <div v-for="investment in accomplishmentCost" :key="investment + Math.random()">
        <img :src="require(`@/assets/icons/${investment}.svg`)" alt="Investment" />
      </div>
    </div>
    <p class="cost">Cost</p>
    <button class="purchase-button" @click="handlePurchase">
      {{ buyButton }}
    </button>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop,  InjectReactive, Inject} from 'vue-property-decorator';
import { canPurchaseAccomplishment } from 'shared/validation';
import { AccomplishmentData, INVESTMENTS, Resource } from 'shared/types';
import { GameRequestAPI } from '@/api/game/request';
import * as _ from 'lodash';

@Component({})
export default class ModalAccomplishment extends Vue {
  @Inject() readonly api!: GameRequestAPI;

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

  get accomplishmentCost() {
    return INVESTMENTS.filter(investment => this.cardData[investment] !== 0).flatMap(investment =>
      _.fill(Array(Math.abs(this.cardData[investment])), investment)
    );
  }

  get canBuy() {
    return canPurchaseAccomplishment(this.cardData, this.$tstore.getters.player.inventory);
  }

  get buyButton() {
    const b = this.canBuy;
    return b ? 'Purchase Accomplishment' : 'You cannot purchase this';
  }

  private handlePurchase() {
    this.api.purchaseAccomplishment(this.cardData);
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/modals/views/ModalAccomplishment.scss';
</style>
