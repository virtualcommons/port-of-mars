<template>
  <div class="card-investment v-step-15">
    <div class="ci-container" :style="opacity">
      <div class="type">
        <p class="name">{{ label }}</p>
        <img :src="require(`@port-of-mars/client/assets/icons/${name}.svg`)" alt="Player" />
        <div class="data">
          <div
            class="investment"
            :style="{
              visibility: !disabled && pendingUnits !== 0 ? 'visible' : 'hidden'
            }"
          >
            <p><span>+</span>{{ pendingUnits }}</p>
          </div>
          <div
            class="cost"
            :style="{ visibility: !disabled ? 'visible' : 'hidden' }"
          >
            <p>
              {{ !disabled ? cost : 'X' }}
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
import { Phase, Resource, Role } from '@port-of-mars/shared/types';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';

@Component({})
export default class CardInvestment extends Vue {
  @Prop() private name!: Resource;
  @Prop() private cost!: number;
  @Prop() private pendingInvestment!: number;

  get disabled(): boolean {
    return this.cost === Number.MAX_SAFE_INTEGER;
  }

  get opacity(): object {
    return this.disabled ? { opacity: '0.5' } : {};
  }

  get pendingUnits() {
    const pendingUnits = this.$tstore.getters.player.pendingInvestments[
      this.name
    ];
    if (pendingUnits) return pendingUnits;
    return 0;
  }


  get label() {
    return this.name == ('upkeep' as any) ? 'System Health' : this.name;
  }

  private setInvestmentAmount(diff: number): void {
    this.$emit('input', {
      name: this.name,
      units: this.pendingInvestment + diff,
      cost: this.cost
    });
  }
}
</script>
,
<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/investmentPhase/CardInvestment.scss';
</style>
