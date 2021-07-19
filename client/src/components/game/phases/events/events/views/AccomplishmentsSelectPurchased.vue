<template>
  <b-container fluid>
    <b-row class="justify-content-center m-2 py-3 text-center">
      <template v-if="completed">
        <p class="pb-3"><strong>You have discarded the Accomplishment below:</strong></p>
      </template>
      <template v-else class="py-2">
        <p class="pb-1"><i>{{ marsEvent.flavorText }}</i></p>
        <p class="pb-3"><strong>{{ marsEvent.effect }}</strong></p>
      </template>
      <div v-if="purchasedAccomplishmentsLength < 1" class="mt-3">
        <b-row class="pt-5">
          <p>No Purchased Accomplishments. Please click 'Continue'.</p>
        </b-row>
        <b-row class="justify-content-center align-items-center pt-3">
          <button class="button" @click="ready">Continue</button>
        </b-row>
      </div>
      <AccomplishmentCard
        v-for="accomplishment in purchasedAccomplishments"
        v-if="!completed"
        :key="accomplishment.id"
        :accomplishment="accomplishment"
        :type="cardType"
        @discardPurchased="stageDiscard"
      />
      <AccomplishmentCard
        v-for="accomplishment in selectedPurchasedAccomplishment"
        v-else
        :key="accomplishment.id"
        :accomplishment="accomplishment"
      />
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {Component, Inject, Vue} from 'vue-property-decorator';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import {AccomplishmentCardType} from '@port-of-mars/client/types/cards';
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

  ready() {
    this.api.setPlayerReadiness(true);
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
