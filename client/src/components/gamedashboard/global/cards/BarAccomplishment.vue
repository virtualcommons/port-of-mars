<template>
  <div class="card-accomplishment">
    <div class="title">
      <p>{{ accomplishment.label }}</p>
    </div>
    <div class="info">
      <div class="points">
        <p>Points</p>
        <p>{{ accomplishment.victoryPoints }}</p>
      </div>
      <div class="flavor-text">
        <p>{{ accomplishment.flavorText }}</p>
      </div>
      <div class="cost">
        <p
          v-for="investment in accomplishmentCost"
          v-bind:class="{
            'unattainable-resource': shouldResourceBeGrayedOut(investment)
          }"
          :key="investment + Math.random()"
        >
          <img
            :src="require(`@/assets/icons/${investment}.svg`)"
            alt="Investment"
          />
        </p>
      </div>
      <div class="purchase">
        <button :disabled="!canBuy" @click="handlePurchase()">
          Purchase Accomplishment
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop,
  InjectReactive,
  Inject
} from 'vue-property-decorator';
import {
  AccomplishmentData,
  Investment,
  INVESTMENTS,
  Resource
} from 'shared/types';
import * as _ from 'lodash';
import { GameRequestAPI } from '@/api/game/request';
import { canPurchaseAccomplishment } from 'shared/validation';

@Component({})
export default class BarAccomplishment extends Vue {
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
  private accomplishment!: AccomplishmentData;

  get accomplishmentCost() {
    return INVESTMENTS.filter(
      investment => this.accomplishment[investment] !== 0
    ).flatMap(investment =>
      _.fill(Array(Math.abs(this.accomplishment[investment])), investment)
    );
  }

  get playerInventory() {
    return _.clone(this.$tstore.getters.player.inventory);
  }

  shouldResourceBeGrayedOut(investment: Investment) {
    if (investment === 'upkeep') {
      return false;
    }

    if (this.playerInventory[investment] > 0) {
      this.playerInventory[investment]--;
      return false;
    }
    return true;
  }

  get canBuy() {
    return canPurchaseAccomplishment(
      this.accomplishment,
      this.$tstore.getters.player.inventory
    );
  }

  private handlePurchase() {
    if (this.canBuy) {
      this.api.purchaseAccomplishment(this.accomplishment);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/cards/BarAccomplishments.scss';

.unattainable-resource {
  opacity: 30%;
}
</style>
