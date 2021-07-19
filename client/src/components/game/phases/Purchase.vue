<template>
  <b-row class="h-100 w-100 p-0 m-0 tour-purchase-action">
      <!-- inventory -->
      <b-col class="d-flex flex-column w-100 py-2 partition tour-inventory" cols="4">
        <b-row class="w-100 m-0 p-3 justify-content-center" style="background-color: var(--main-brand)">
          <p class="title">Inventory</p>
        </b-row>
        <b-row class="flex-grow-1 w-100 p-3 mt-3 mx-auto"
               style="background-color: var(--light-shade-05); overflow-y: auto; overflow-x: hidden;"
        >
          <div class="position-absolute px-2 mb-5" style="overflow-y: auto; overflow-x: hidden;
          width: 90%">
            <Inventory :isSelf="true"/>
          </div>
        </b-row>
      </b-col>

      <!-- purchasable accomplishments -->
      <b-col class="d-flex flex-column h-100 w-100 py-2 tour-purchase" cols="8">
        <b-row class="h-auto w-100 m-0 p-3 justify-content-center"
               style="background-color: var(--main-brand)"
        >
          <p class="title">Purchasable Accomplishments</p>
        </b-row>
        <b-row class="flex-grow-1 w-100 p-3 mt-2 mx-0"
               style="background-color: var(--light-shade-05); overflow-y: auto; overflow-x: hidden;"
        >

          <div class="position-absolute" style="overflow-y: auto; overflow-x: hidden;
               max-width: 92%; max-height: 80%;">
            <AccomplishmentCard
              v-for="accomplishment in sortedAccomplishments"
              :key="accomplishment.id"
              :accomplishment="accomplishment"
              :showCard="wasPurchased(accomplishment.id)"
              :type="cardType"
              @purchased="purchase(accomplishment)"
            />
          </div>

        </b-row>
      </b-col>
  </b-row>
</template>

<script lang="ts">
import {Component, Inject, Vue} from 'vue-property-decorator';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import Inventory from '@port-of-mars/client/components/game/Inventory.vue';
import {AccomplishmentCardType} from '@port-of-mars/client/types/cards';
import {AccomplishmentData} from '@port-of-mars/shared/types';
import {canPurchaseAccomplishment} from "@port-of-mars/shared/validation";
import {GameRequestAPI} from "@port-of-mars/client/api/game/request";

@Component({
  components: {
    AccomplishmentCard,
    Inventory,
  },
})
export default class Purchase extends Vue {
  @Inject() readonly api!: GameRequestAPI;

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

  purchase(accomplishment: AccomplishmentData) {
    this.api.purchaseAccomplishment(accomplishment);
  }
}
</script>

<style lang="scss" scoped>
.title {
  margin: 0 1rem 0 0;
  font-size: $font-med;
  font-weight: $bold;
  color: $phase-topbar-foreground;
}

.partition {
  border-right: .2rem solid;
  border-color: $light-shade-25;
}
</style>
