<template>
  <div class="c-purchase container tour-purchase">
    <div class="wrapper row">
      <div class="inventory col-4">
        <div class="topbar">
          <p class="title">Inventory</p>
        </div>
        <div class="outer-wrapper">
          <div class="wrapper">
            <Inventory :displaySystemHealth="false" />
          </div>
        </div>
      </div>
      <div class="purchasableaccomplishments col-8">
        <div class="topbar">
          <p class="title">Purchasable Accomplishments</p>
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
import { Vue, Component,Inject } from 'vue-property-decorator';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import Inventory from '@port-of-mars/client/components/game/Inventory.vue';
import { canPurchaseAccomplishment } from '@port-of-mars/shared/validation';
import { AccomplishmentCardType } from '@port-of-mars/client/types/cards.ts';
import { AccomplishmentData } from '@port-of-mars/shared/types';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';

@Component({
  components: {
    AccomplishmentCard,
    Inventory,
  },
})
export default class Purchase extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  get playerInfo() {
    return {
      info: this.$tstore.getters.player,
      isSelf: true,
    };
  }

  

  get purchasableAccomplishments() {
    let accomplishments = this.$store.getters.player.accomplishments.purchasable
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

      if(!canPurchaseAccomplishment(accomplishments[0], this.$store.getters.player.inventory)){
        this.api.setPlayerReadiness(true);
      }

      return accomplishments;
  }

  get cardType() {
    return AccomplishmentCardType.purchase;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/Purchase.scss';
</style>
