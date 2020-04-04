<template>
  <div class="container-purchase tour-discard">
    <div class="purchase-row">
      <div class="info">
        <div class="section-text">
          <p>Inventory</p>
        </div>
        <div class="inventory">
          <InventoryTable
            class="inventory-table"
            :playerData="playerInfo"
            :isVisible="true"
          />
        </div>
      </div>

      <div class="actions">
        <div class="section-text">
          <p>Discardable Accomplishments</p>
        </div>
        <div class="outer-wrapper">
          <div class="wrapper">
            <AccomplishmentCard
              v-for="accomplishment in purchasableAccomplishments"
              :key="accomplishment.label + 2"
              :accomplishment="accomplishment"
              :type="cardType"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import InventoryTable from '@port-of-mars/client/components/game/InventoryTable.vue';
import { canPurchaseAccomplishment } from '@port-of-mars/shared/validation';
import { AccomplishmentCardType } from '@port-of-mars/client/types/cards.ts';
import { AccomplishmentData } from '@port-of-mars/shared/types';

@Component({
  components: {
    AccomplishmentCard,
    InventoryTable,
  },
})
export default class Discard extends Vue {
  get purchasableAccomplishments() {
    return this.$store.getters.player.accomplishments.purchasable
      .slice()
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
  }

  get playerInfo() {
    return {
      info: this.$tstore.getters.player,
      isSelf: true,
    };
  }

  get cardType() {
    return AccomplishmentCardType.discard;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/Discard.scss';
</style>
