<template>
  <b-container fluid>
    <b-row class="justify-content-center m-3">
      <template v-if="purchasedAccomplishmentsLength > 0">
        <p class="pb-1"><i>{{ marsEvent.flavorText }}</i></p>
        <p><strong>{{ marsEvent.effect }}</strong></p>
      </template>
      <p v-if="purchasedAccomplishmentsLength < 1">
        No Purchased Accomplishments. Please click 'Continue'.
      </p>
      <AccomplishmentCard
        v-else
        :accomplishment="accomplishment"
        :key="accomplishment.id"
        @discarded="handleDiscardAccomplishment"
        :type="discardType"
        v-for="accomplishment in purchasedAccomplishments"
        :showAvailableResources="showResources"
      />
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {Component, Inject, Prop, Vue} from 'vue-property-decorator';
import _ from "lodash";
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import {AccomplishmentCardType} from '@port-of-mars/client/types/cards.ts'
import {AccomplishmentData, MarsEventData, RESEARCHER} from '@port-of-mars/shared/types';
import {GameRequestAPI} from "@port-of-mars/client/api/game/request";
import accomplishments from "@port-of-mars/client/store/mutations/accomplishments";

@Component({
  components: {
    AccomplishmentCard,
  },
})
export default class AccomplishmentsSelectPurchased extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  @Prop() complete: boolean = false;
  @Prop() showResources: boolean = false;
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

  get discardType() {
    return AccomplishmentCardType.discard;
  }

  get purchasedAccomplishments() {
    // TODO: There's definitely a better place to do this...
    // this.purchasedAccomplishmentsLength = Object.keys(purchased).length;
    return this.$tstore.getters.player.accomplishments.purchased;
  }

  get purchasedAccomplishmentsLength() {
    return Object.keys(this.purchasedAccomplishments).length;
  }


  private handleDiscardAccomplishment(id: number) {
    const test = _.slice(this.purchasedAccomplishments, 0, this.purchasedAccomplishments.length)
    const test2 = _.filter(test, accomplishment => accomplishment.id = id)

    this.selectedPurchasedAccomplishment = test2[0] as AccomplishmentData;
    this.api.stageDiscardOfPurchasedAccomplishment(id);
    // this.api.discardAccomplishment(id)
  }

  /**
   * Asynchronously change accomplishment status to discarded.
   * @param id The ID number of an accomplishment.
   * > Hide accomplishments on client side when status changes
   * > Filter accomplishments by ID - if ID is not in the array, card has been discarded
   */
  wasDiscarded(id: number): boolean {
    // possible that animation isn't working because of the 'staged' discard
    // card is technically still available in purchased, changes have't been applied yet
    return this.selectedPurchasedAccomplishment.id === id;

  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/events/events/views/AccomplishmentsSelectPurchased.scss';
</style>
