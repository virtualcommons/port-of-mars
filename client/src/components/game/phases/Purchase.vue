<template>
  <b-row class="h-100 w-100 p-0 m-0 tour-purchase-action">
    <!-- inventory -->
    <b-col cols="4" class="d-flex flex-column h-100 w-100 light-shade-25-partition tour-inventory">
      <b-row class="h-auto w-100 justify-content-center mx-auto p-3 tour-time-blocks header">
        <p class="mx-2 my-auto">Inventory</p>
      </b-row>
      <b-row class="flex-grow-1 w-100 mx-auto my-3 p-2 backdrop">
        <b-col>
          <Inventory :isSelf="true" />
        </b-col>
      </b-row>
    </b-col>

    <!-- purchasable accomplishments -->
    <b-col cols="8" class="d-flex flex-column h-100 w-100 tour-purchase">
      <b-row class="h-auto w-100 justify-content-center mx-auto p-3 header">
        <p class="mx-2 my-auto">Purchasable Accomplishments</p>
      </b-row>
      <b-row class="flex-grow-1 w-100 mx-auto my-3 p-2 backdrop">
        <b-col>
          <div class="h-100 p-2 scrollable">
            <AccomplishmentCard
              v-for="accomplishment in sortedAccomplishments"
              :key="accomplishment.id"
              :accomplishment="accomplishment"
              :showCard="wasPurchased(accomplishment.id)"
              :type="cardType"
              @purchased="purchase(accomplishment)"
            ></AccomplishmentCard>
          </div>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import AccomplishmentCard from "@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue";
import Inventory from "@port-of-mars/client/components/game/Inventory.vue";
import { AccomplishmentCardType } from "@port-of-mars/client/types/cards";
import { AccomplishmentData } from "@port-of-mars/shared/types";
import { canPurchaseAccomplishment } from "@port-of-mars/shared/validation";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";

@Component({
  components: {
    AccomplishmentCard,
    Inventory
  }
})
export default class Purchase extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  // sort accomplishments by purchasable in ascending order
  // static and is set when component is created; does not update with changes
  private sortedAccomplishments = this.$store.getters.player.accomplishments.purchasable
    .slice()
    .sort((a: AccomplishmentData, b: AccomplishmentData) => {
      return (
        Number(canPurchaseAccomplishment(b, this.$store.getters.player.inventory)) -
        Number(canPurchaseAccomplishment(a, this.$store.getters.player.inventory))
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
    return Boolean(
      (this.$tstore.getters.player.accomplishments.purchasable as Array<AccomplishmentData>)
        .slice()
        .filter(accomplishment => accomplishment.id == id).length > 0
    );
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
  border-right: 0.2rem solid;
  border-color: $light-shade-25;
}
</style>
