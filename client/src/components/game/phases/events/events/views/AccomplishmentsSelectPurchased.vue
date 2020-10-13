<template>
  <b-container fluid>
    <b-row class="justify-content-center m-2 pt-3 text-center">
      <template class="py-2" v-if="completed">
        <p><strong>You have discarded the Accomplishment below.</strong></p>
      </template>
      <template class="py-2" v-else>
        <p class="pb-1"><i>{{ marsEvent.flavorText }}</i></p>
        <p><strong>{{ marsEvent.effect }}</strong></p>
      </template>
      <div class="mt-3" v-if="purchasedAccomplishmentsLength < 1">
        <b-row class="pt-5">
          <p>No Purchased Accomplishments. Please click 'Continue'.</p>
        </b-row>
        <b-row class="justify-content-center align-items-center pt-3">
          <button @click="ready" class="button">Continue</button>
        </b-row>
      </div>
      <AccomplishmentCard
        v-if="!completed"
        :accomplishment="accomplishment"
        :key="accomplishment.id"
        @discardPurchased="stageDiscard"
        :type="cardType"
        v-for="accomplishment in purchasedAccomplishments"
      />
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {Component, Inject, Vue} from 'vue-property-decorator';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import {AccomplishmentCardType} from '@port-of-mars/client/types/cards.ts'
import {AccomplishmentData, MarsEventData, RESEARCHER} from '@port-of-mars/shared/types';
import {GameRequestAPI} from "@port-of-mars/client/api/game/request";
import _ from 'lodash';

@Component({
  components: {
    AccomplishmentCard,
  },
})
export default class AccomplishmentsSelectPurchased extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  purchasedAccomplishmentsLength: number = Object.keys(this.purchasedAccomplishments).length;

  private selectedPurchasedAccomplishment: AccomplishmentData = {
    id: -1,
    role: RESEARCHER,
    label: '',
    flavorText: '',
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0,
    systemHealth: 0,
    victoryPoints: 0,
    effect: '',
  };

  ready() {
    this.api.setPlayerReadiness(true);
  }

  get marsEvent(): MarsEventData {
    return this.$tstore.getters.currentEvent!;
  }

  get cardType() {
    return AccomplishmentCardType.discard;
  }

  get purchasedAccomplishments() {
    const purchased = this.$tstore.getters.player.accomplishments.purchased;

    // TODO: There's definitely a better place to do this...
    this.purchasedAccomplishmentsLength = Object.keys(purchased).length;
    return purchased;
  }

  get completed() {
    return this.selectedPurchasedAccomplishment.id !== -1;
  }

  private stageDiscard(id: number) {
    const pendingAccomplishmentDiscard = _.filter(this.purchasedAccomplishments, accomplishment => accomplishment.id);

    // deep copy of pending accomplishment to discard
    this.selectedPurchasedAccomplishment = JSON.parse(JSON.stringify(pendingAccomplishmentDiscard));
    this.api.stageDiscardOfPurchasedAccomplishment(id);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/events/events/views/AccomplishmentsSelectPurchased.scss';
</style>
