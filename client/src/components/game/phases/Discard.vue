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

      <!-- discardable accomplishments -->
      <b-col class="h-100 w-100 py-2 tour-purchase" cols="8">
        <div class="header">
          <p class="title">Discard Accomplishments</p>
        </div>
        <div class="p-3 w-100 outer-wrapper">
          <div class="w-100 wrapper">
            <AccomplishmentCard
              :accomplishment="accomplishment"
              :key="accomplishment.label + 2"
              :showCard="wasDiscarded(accomplishment.id)"
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

@Component({
  components: {
    AccomplishmentCard,
    Inventory,
  },
})
export default class Discard extends Vue {
  private accomplishments = Array<AccomplishmentData>();

  /**
   * Get card type: default (0), purchase (1), discard (2)
   */
  get cardType(): AccomplishmentCardType {
    return AccomplishmentCardType.discard;
  }

  //sorts the accomplishments, showing the ones you cannot buy first.
  //this is static and gets set as the component is created, but does not update with changes
  get sortedAccomplishments(): Array<AccomplishmentData> {
    return this.$tstore.getters.sortedAccomplishments;
  }

  updated() {
    this.accomplishments = this.sortedAccomplishments
  }

  //this does update with changes, allowing us to change the status of the accomplishment asynchronously
  wasDiscarded(id: number) {
    return Boolean((this.$store.getters.player.accomplishments.purchasable as Array<AccomplishmentData>)
      .slice()
      .filter(accomplishment => accomplishment.id == id).length > 0);//if the id is not in the array, it must have been discarded.
  }

}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/Discard.scss';
</style>
