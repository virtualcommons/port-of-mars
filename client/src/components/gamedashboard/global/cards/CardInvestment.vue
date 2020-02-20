<template>
  <div class="card-investment v-step-15" :style="setOpacity()">
    <div class="ci-container">
      <div class="type">
        <p class="name">{{ name }}</p>
        <img :src="require(`@/assets/icons/${name}.svg`)" alt="Player" />
        <div class="data">
          <div class="cost">
            <p>
              {{ cost <= 1000 ? cost : 'X' }}
            </p>
          </div>
        </div>
      </div>
      <div class="increment-decrement" v-if="!disabled">
        <button
          class="increment"
          type="button"
          name="Investment Increment"
          @click="setInvestmentAmount(1)"
        >
          +
        </button>
        <button
          class="decrement"
          type="button"
          name="Investment Decrement"
          @click="setInvestmentAmount(-1)"
        >
          -
        </button>
      </div>
      <div class="increment-decrement-disabled" v-if="disabled"></div>
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
import { Phase, Resource, Role } from 'shared/types';
import { GameRequestAPI } from '@/api/game/request';

@Component({})
export default class CardInvestment extends Vue {
  @Prop() private name!: Resource;
  @Prop() private cost!: number;
  @Prop() private pendingInvestment!: number;

  get disabled(): boolean {
    return this.cost === Number.MAX_SAFE_INTEGER;
  }

  private setInvestmentAmount(diff: number): void {
    this.$emit('input', {
      name: this.name,
      units: this.pendingInvestment + diff,
      cost: this.cost
    });
  }

  private setOpacity(): object {
    if (this.disabled) {
      return { opacity: '50%' };
    }
  }
}
</script>
,
<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/cards/CardInvestment.scss';
</style>
