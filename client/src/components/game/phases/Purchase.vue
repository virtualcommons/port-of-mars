<template>
  <b-container class="h-100 p-0 m-0 tour-purchase-action" fluid>
    <b-row class="h-100 w-100 p-0 m-0">
      <!-- inventory -->
      <b-col class="h-100 w-100 py-2 tour-inventory" cols="4">
        <div class="header">
          <p class="title">Inventory</p>
        </div>
        <div class="p-2 w-100 outer-wrapper">
          <div class="w-100">
            <Inventory :isSelf="true"/>
          </div>
        </div>
      </b-col>

      <!-- purchasable accomplishments -->
      <b-col class="h-100 w-100 py-2 tour-purchase" cols="8">
        <div class="header">
          <p class="title">Purchasable Accomplishments</p>
        </div>
        <div class="p-3 w-100 outer-wrapper">
          <div class="w-100 wrapper">
            <AccomplishmentCard
              :accomplishment="accomplishment"
              :key="accomplishment.label + 2"
              :showCard="wasPurchased(accomplishment.id)"
              :type="cardType"
              v-for="accomplishment in sortedAccomplishments"
            />
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
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
export default class Purchase extends Vue {
  // sort accomplishments by purchasable in ascending order
  // static and is set when component is created; does not update with changes
  private sortedAccomplishments = this.$store.getters.player.accomplishments.purchasable.slice()
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
    return AccomplishmentCardType.purchase;
  }

  /**
   * Asynchronously change accomplishment status to purchased.
   * @param id The ID number of an accomplishment.
   * > Hide accomplishments on client side when status changes
   * > Filter accomplishments by ID - if ID is not in the array, card has been purchased
   */
  wasPurchased(id: number): boolean {
    return Boolean((this.$tstore.getters.player.accomplishments.purchasable as Array<AccomplishmentData>)
      .slice()
      .filter(accomplishment => accomplishment.id == id).length > 0);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/Purchase.scss';
</style>
