<template>
  <div class="event-select-purchased-accomplishment-container">
    <div class="actions">
      <div>
        <p v-if="purchasedAccomplishmentsLength === 0">
          No Purchased Accomplishments. Please click 'Continue'.
        </p>
        <button
          v-for="accomplishment in purchasedAccomplishments"
          :key="accomplishment.id"
          @click="handleDiscardAccomplishment(accomplishment)"
          :style="handleAccomplishmentStyle(accomplishment)"
          type="button"
          name="Discard Accomplishment"
        >
          {{ accomplishment.label }}
        </button>
      </div>
      <div>
        <button
          @click="handleContinue"
          :disabled="completed === false"
          type="button"
          name="Continue Button"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { AccomplishmentData, RESEARCHER } from '@port-of-mars/shared/types';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';

@Component({
  components: {
    AccomplishmentCard,
  },
})
export default class AccomplishmentsSelectPurchased extends Vue {
  private purchasedAccomplishmentsLength: number = -1;
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
    upkeep: 0,
    victoryPoints: 0,
    effect: '',
  };

  // get purchasableAccomplishments() {
  //   const purchasable = this.$store.getters.player.accomplishment.purchasable;
  //   console.log('purchasableAccomplishments:', purchasable);
  //   return purchasable;
  // }

  get purchasedAccomplishments() {
    const purchased = this.$store.getters.player.accomplishment.purchased;

    // TODO: There's definitely a better place to do this...
    this.purchasedAccomplishmentsLength = Object.keys(purchased).length;
    return purchased;
  }

  get completed() {
    if (
      this.purchasedAccomplishmentsLength === 0 ||
      this.selectedPurchasedAccomplishment.id !== -1
    ) {
      return true;
    }
    return false;
  }

  private handleDiscardAccomplishment(a: any) {
    // this.$root.$emit('openModalConfirmation', {
    //   text: `Selecting \"Yes\" will discard the accomplishment \"${a.label}\" and a new card will be drawn next round.`,
    //   type: 'discardAccomplishment',
    //   actionData: a.id
    // });
    this.selectedPurchasedAccomplishment = a;
  }

  private handleContinue() {
    console.log(
      'DISCARD PURCHASED ACCOMPLISHMENT:',
      this.selectedPurchasedAccomplishment
    );
  }

  private handleAccomplishmentStyle(a: any) {
    if (a.id === this.selectedPurchasedAccomplishment.id) {
      return {
        backgroundColor: 'var(--new-space-orange)',
        color: 'var(--space-gray)',
      };
    }
    return {};
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/events/events/views/AccomplishmentsSelectPurchased.scss';
</style>
