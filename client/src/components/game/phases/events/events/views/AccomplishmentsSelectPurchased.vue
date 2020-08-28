<template>
  <div class="event-select-purchased-accomplishment-container">
    <div class="actions">
      <div>
        <template v-if="purchasedAccomplishmentsLength > 0">
          <p>
            {{ marsEvent.effect }}
          </p>
          <p>
            {{ marsEvent.flavorText }}
          </p>
        </template>
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
          {{ accomplishment.label }} ({{ accomplishment.victoryPoints }} Points)
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop, Inject} from 'vue-property-decorator';
  import {AccomplishmentData, MarsEventData, RESEARCHER} from '@port-of-mars/shared/types';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
  import {AbstractGameAPI} from "@port-of-mars/client/api/game/types";

@Component({
  components: {
    AccomplishmentCard,
  },
})
export default class AccomplishmentsSelectPurchased extends Vue {
  @Inject()
  api!: AbstractGameAPI;

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
    systemHealth: 0,
    victoryPoints: 0,
    effect: '',
  };

  get marsEvent(): MarsEventData {
    return this.$tstore.getters.currentEvent!;
  }

  get purchasedAccomplishments() {
    const purchased = this.$tstore.getters.player.accomplishments.purchased;

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

  private handleDiscardAccomplishment(accomplishment: AccomplishmentData) {
    this.selectedPurchasedAccomplishment = accomplishment;
    this.api.stageDiscardOfPurchasedAccomplishment(accomplishment.id);
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
        backgroundColor: 'var(--light-accent)',
        color: 'var(--dark-shade)',
      };
    }
    return {};
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/events/events/views/AccomplishmentsSelectPurchased.scss';
</style>
