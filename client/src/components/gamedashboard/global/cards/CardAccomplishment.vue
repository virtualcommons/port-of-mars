<template>
  <div class="card-accomplishment" @click="handleClick">
    <div class="title">
      <p>{{ accomplishment.label }}</p>
    </div>
    <div class="info">
      <div class="points">
        <p>Points</p>
        <p>{{ accomplishment.victoryPoints }}</p>
      </div>
      <div class="cost">
        <p v-for="investment in accomplishmentCost">
          <img :src="require(`@/assets/icons/${investment}.svg`)" alt="Investment" />
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { AccomplishmentData, INVESTMENTS, Resource } from 'shared/types';
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
    ).flatMap(investment => _.fill(Array(Math.abs(this.accomplishment[investment])), investment));
  }

  private handleClick() {
    this.$root.$emit('openModalCard', {
      card: 'accomplishment',
      payload: this.accomplishment
    });
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/cards/CardAccomplishment.scss';
</style>
