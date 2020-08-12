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
      <div class="purchasable col-8">
        <div class="header">
          <p class="title">Discard Accomplishments</p>
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
  //sorts the accomplishments, showing the ones you cannot buy first.
  //this is static and gets set as the component is created, but does not update with changes
  private staticAccomplishments = this.$store.getters.player.accomplishments.purchasable.slice()
      .sort((a: AccomplishmentData, b: AccomplishmentData) => {
        return (
          Number(
            canPurchaseAccomplishment(a, this.$store.getters.player.inventory)
          ) -
          Number(
            canPurchaseAccomplishment(b, this.$store.getters.player.inventory)
          )
        );
      });

  //this does update with changes, allowing us to change the status of the accomplishment asynchronously
  wasDiscarded(id: number){
    return Boolean((this.$store.getters.player.accomplishments.purchasable as Array<AccomplishmentData>)
      .slice()
      .filter(accomplishment => accomplishment.id == id).length > 0);//if the id is not in the array, it must have been discarded.
  }

  get cardType() {
    return AccomplishmentCardType.discard;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/Discard.scss';
</style>
