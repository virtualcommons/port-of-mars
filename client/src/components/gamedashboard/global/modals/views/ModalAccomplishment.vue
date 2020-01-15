<template>
  <div class="modal-accomplishment">
    <p class="title">{{ cardData.label }}</p>
    <p class="info">{{ cardData.flavorText }}</p>
    <div class="investments">
      <div v-for="investment in accomplishmentCost" :key="investment + Math.random()"
      v-bind:class="{'unattainable-resource': shouldResourceBeGrayedOut(investment)}"
      >
        <img :src="require(`@/assets/icons/${investment}.svg`)" alt="Investment" />
      </div>
    </div>
    <p class="cost">Cost</p>
    <p class="purchase-button">
      {{ buyText }}
    </p>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop,  InjectReactive, Inject} from 'vue-property-decorator';
import { canPurchaseAccomplishment } from 'shared/validation';
import { AccomplishmentData, INVESTMENTS, Resource } from 'shared/types';
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

  get accomplishmentCost() {
    return INVESTMENTS.filter(investment => this.cardData[investment] !== 0).flatMap(investment =>
      _.fill(Array(Math.abs(this.cardData[investment])), investment)
    );
  }

  get canBuy() {
    return canPurchaseAccomplishment(this.cardData, this.$tstore.getters.player.inventory);
  }

  get playerInventory() {
    return _.clone(this.$tstore.getters.player.inventory);
  }

  shouldResourceBeGrayedOut(resource){
    if(resource=='upkeep'){
      return false;
    }

    if(this.playerInventory[resource] > 0){
      this.playerInventory[resource]--;
      return false;
    }
    return true
  }

  get buyText() {
    const b = this.canBuy;
    return b ? 'You have the resources to purchase this' : 'You cannot purchase this';
  }

}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/modals/views/ModalAccomplishment.scss';

.unattainable-resource{
  opacity: 30%;
}
</style>
