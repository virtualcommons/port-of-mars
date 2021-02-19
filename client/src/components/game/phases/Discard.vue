<template>
  <b-container class="h-100 p-0 m-0 tour-discard-action" fluid>
    <b-row class="h-100 w-100 p-0 m-0">
      <!-- inventory -->
      <b-col class="h-100 w-100 py-2 partition" cols="4">
        <div class="header">
          <p class="title">Inventory</p>
        </div>
        <b-container class="p-3 mt-3 outer" fluid>
          <Inventory :isSelf="true"/>
        </b-container>
      </b-col>

      <!-- discardable accomplishments -->
      <b-col class="h-100 w-100 py-2" cols="8">
        <div class="header">
          <p class="title">Discard Accomplishments</p>
        </div>
        <b-container class="p-3 mt-3 outer" fluid>
          <AccomplishmentCard
            :accomplishment="accomplishment"
            :key="accomplishment.id"
            @discarded="discardAccomplishment"
            :showCard="wasDiscarded(accomplishment.id)"
            :type="cardType"
            v-for="accomplishment in sortedAccomplishments"
          />
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {Inject, Component, Vue} from 'vue-property-decorator';

import {GameRequestAPI} from '@port-of-mars/client/api/game/request';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import Inventory from '@port-of-mars/client/components/game/Inventory.vue';
import {AccomplishmentCardType} from '@port-of-mars/client/types/cards.ts';
import {AccomplishmentData} from '@port-of-mars/shared/types';
import {canPurchaseAccomplishment} from "@port-of-mars/shared/validation";

@Component({
  components: {
    AccomplishmentCard,
    Inventory,
  },
})
export default class Discard extends Vue {
  @Inject() readonly api!: GameRequestAPI;
  // sort accomplishments by purchasable in ascending order
  // static and is set when component is created; does not update with changes
  private sortedAccomplishments = this.$tstore.getters.player.accomplishments.purchasable.slice()
    .sort((a: AccomplishmentData, b: AccomplishmentData) => {
      return (
        Number(
          canPurchaseAccomplishment(b, this.$store.getters.player.inventory)
        ) -
        Number(
          canPurchaseAccomplishment(a, this.$store.getters.player.inventory)
        )
      );
    });

  /**
   * Get card type: default (0), purchase (1), discard (2)
   */
  get cardType(): AccomplishmentCardType {
    return AccomplishmentCardType.discard;
  }

  /**
   * Asynchronously change accomplishment status to discarded.
   * @param id The ID number of an accomplishment.
   * > Hide accomplishments on client side when status changes
   * > Filter accomplishments by ID - if ID is not in the array, card has been discarded
   */
  wasDiscarded(id: number): boolean {
    return Boolean((this.$tstore.getters.player.accomplishments.purchasable as Array<AccomplishmentData>)
      .slice()
      .filter(accomplishment => accomplishment.id == id).length > 0);
  }

  discardAccomplishment(accomplishmentId: number) {
    this.api.discardAccomplishment(accomplishmentId);
  }

}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/Discard.scss';
</style>
