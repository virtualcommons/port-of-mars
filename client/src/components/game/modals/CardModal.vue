<template>
  <div class="card-modal">
    <div class="cards-wrapper">
      <div class="cards">
        <AccomplishmentCard
          v-if="modalData.cardType === 'AccomplishmentCard'"
          class="accomplishment-card"
          :key="modalData.cardData.id"
          :accomplishment="modalData.cardData"
          :isModal="true"
        />
        <EventCard
          v-else-if="modalData.cardType === 'EventCard'"
          class="event-card"
          :key="modalData.cardData.id"
          :event="modalData.cardData"
          :visible="true"
          :isModal="true"
          :wasSpawnedByServer="serverCreated(modalData.activator)"
        />
      </div>
    </div>
    <div v-if="modalData.confirmation" class="d-flex flex-row confirm-wrapper">
      <div class="confirm col-12">
        <p class="confirm-text">Are you sure you want do proceed? </p>
        <button @click="handleConfirmation">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop } from 'vue-property-decorator';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { CardModalData } from '@port-of-mars/shared/game/client/modals';
import { Phase } from '@port-of-mars/shared/types';
import EventCard from '@port-of-mars/client/components/game/phases/events/EventCard.vue';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';

@Component({
  components: {
    EventCard,
    AccomplishmentCard,
  },
})
export default class CardModal extends Vue {
  @Prop({}) private modalData!: CardModalData;
  @Inject() readonly api!: GameRequestAPI;

  get gamePhase() {
    return this.$tstore.state.phase;
  }

  get phase() {
    return Phase;
  }

  get canDiscard() {
    return !!(this.gamePhase === this.phase.discard &&
      this.modalData.cardType === 'AccomplishmentCard' &&
      this.modalData.cardData.id);
  }

  private handleConfirmation() {
    if (this.canDiscard) {
      this.api.discardAccomplishment(this.modalData.cardData.id as number);
    }
    this.api.setModalHidden();
  }

  private serverCreated(activator:string){
    return activator == 'Server';
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/modals/CardModal.scss';
</style>
