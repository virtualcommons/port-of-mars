<template>
  <div class="c-discard container tour-discard-action">
    <div class="wrapper row">
      <div class="inventory col-4">
        <div class="topbar">
          <p class="title">Inventory</p>
        </div>
        <div class="outer-wrapper">
          <div class="wrapper">
            <Inventory :isSelf="true" />
          </div>
        </div>
      </div>
      <div class="purchasableaccomplishments col-8">
        <div class="topbar">
          <p class="title">Discardable Accomplishments</p>
        </div>
        <div class="outer-wrapper">
          <div class="wrapper">
            <AccomplishmentCard
              v-for="accomplishment in staticAccomplishments"
              :key="accomplishment.label + 2"
              :accomplishment="accomplishment"
              :type="cardType"
              :showCard="wasDiscarded(accomplishment.id)"
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
import Inventory from '@port-of-mars/client/components/game/Inventory.vue';
import { canPurchaseAccomplishment } from '@port-of-mars/shared/validation';
import { AccomplishmentCardType } from '@port-of-mars/client/types/cards.ts';
import { AccomplishmentData } from '@port-of-mars/shared/types';

@Component({
  components: {
    AccomplishmentCard,
    Inventory,
  },
})
export default class Discard extends Vue {
  private staticAccomplishments = this.$store.getters.player.accomplishments.purchasable.slice()
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

  wasDiscarded(id: number){
    console.log(this.$store.getters.player.accomplishments.purchasable)
    return Boolean((this.$store.getters.player.accomplishments.purchasable as Array<AccomplishmentData>)
      .slice()
      .filter(accomplishment => accomplishment.id == id).length > 0);
  }

  get cardType() {
    return AccomplishmentCardType.discard;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/Discard.scss';
</style>
