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
        <div
          v-for="investment in accomplishmentCost"
          v-bind:class="{
            'unattainable-resource': shouldResourceBeGrayedOut(investment)
          }"
          :key="investment + Math.random()"
          class="container"
        >
          <img
            :src="require(`@port-of-mars/client/assets/icons/${investment}.svg`)"
            alt="Investment"
          />
        </div>
      </div>
      <div class="discard">
        <button
          @click="handleDiscardAccomplishment(accomplishment)"
          type="button"
          name="Discard Accomplishment"
        >
          Discard
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';
import {
  AccomplishmentData,
  Investment,
  INVESTMENTS,
  Resource
} from '@port-of-mars/shared/types';
import * as _ from 'lodash';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { canPurchaseAccomplishment } from '@port-of-mars/shared/validation';

@Component({})
export default class BarDiscard extends Vue {
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

  private shouldResourceBeGrayedOut(investment: Investment) {
    if (investment === 'upkeep') {
      return false;
    }

    if (this.playerInventory[investment] > 0) {
      this.playerInventory[investment]--;
      return false;
    }
    return true;
  }

  private handleDiscardAccomplishment(a: any) {
    // console.log(this.$store.getters.layout);
    if (this.$store.getters.layout == 'tutorial') {
      this.api.discardAccomplishment(a.id);
    } else {
      this.$root.$emit('openmodalconfirmation', {
        text: `Selecting \"Yes\" will discard the accomplishment \"${a.label}\" and a new card will be drawn next round.`,
        victoryPoints: a.victoryPoints,
        cost: this.accomplishmentCost,
        phaseOpened: this.$store.state.phase,
        type: 'discardAccomplishment',
        actionData: a.id
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/GameDashboardPhases/phases/discardPhase/BarDiscard.scss';
</style>
