<template>
  <div class="cm-accomplishment" :style="opacity">
    <div class="cm-accomplishment-title">
      <p>{{ cardData.label }}</p>
    </div>
    <div class="cm-accomplishment-info">
      <p>{{ cardData.flavorText }}</p>
    </div>
    <div class="cm-accomplishment-investments">
      <p v-for="investment in cardData.totalCostArray" :key="investment + Math.random()">
        <!-- Note: will need to edit key implementation -->
        <img :src="require(`@/assets/icons/${investment}.svg`)" alt="investment" />
      </p>
    </div>
    <p class="cm-accomplishment-investments-title"><span>Cost</span></p>
    <button class="cm-accomplishment-purchase-button" @click="handlePurchase">
      {{ buyButton }}
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';
import { canPurchaseAccomplishment } from 'shared/validation';
import { AccomplishmentData } from 'shared/types';
import { GameRequestAPI } from '@/api/game/request';

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

  private opacity: string = '';

  @Inject() $api!: GameRequestAPI;

  get canBuy() {
    return canPurchaseAccomplishment(this.cardData, this.$tstore.getters.player.inventory);
  }

  get buyButton() {
    this.opacity = 'opacity:100%';
    const b = this.canBuy;
    return b ? 'Purchase accomplishment' : 'You cannot purchase this';
  }

  handlePurchase() {
    this.$api.purchaseAccomplishment(this.cardData);
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/modals/views/ModalAccomplishment.scss';
</style>
