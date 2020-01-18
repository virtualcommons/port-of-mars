<template>
  <div class="event-select-purchased-accomplishment-container">
    <div class="actions">
      <div>
        <p v-if="purchasedAccomplishmentsLength === 0">
          No Bought Accomplishments. Please click 'Continue'.
        </p>
        <button
          v-for="accomplishment in boughtAccomplishments"
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
import CardAccomplishment from '@/components/gamedashboard/global/cards/CardAccomplishment.vue';

@Component({
  components: {
    CardAccomplishment
  }
})
export default class AccomplishmentsSelectPurchased extends Vue {
  private purchasedAccomplishmentsLength: number = -1;
  private selectedPurchasedAccomplishment: object = {};

  get boughtAccomplishments() {
    const bought = this.$store.getters.player.accomplishment.bought;

    // TODO: There's definitely a better place to do this...
    console.log('bought:', bought);
    this.purchasedAccomplishmentsLength = Object.keys(bought).length;
    console.log(
      'purchasedAccomplishmentsLength:',
      this.purchasedAccomplishmentsLength
    );

    return bought;
  }

  get completed() {
    if (
      this.purchasedAccomplishmentsLength === 0 ||
      this.selectedPurchasedAccomplishment.id !== undefined
    ) {
      return true;
    }
    return false;
  }

  // get purchasableAccomplishments() {
  //   const purchased = this.$store.getters.player.accomplishment.purchasable;
  //   return purchased;
  // }

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
        backgroundColor: 'var(--space-orange)',
        color: 'var(--space-gray)'
      };
    }
    return {};
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/events/views/AccomplishmentsSelectPurchased.scss';
</style>
