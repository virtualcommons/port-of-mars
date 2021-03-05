<template>
  <b-row class="h-100 w-100 p-0 m-0"
         style="background-color: var(--light-shade-05)">
      <!-- types of cards to display in modal -->
      <b-col class="w-100 h-100 m-0 p-0" style="background-color: var(--dark-shade)">
        <!-- accomplishment -->
        <AccomplishmentCard
          v-if="modalData.cardType === 'AccomplishmentCard'"
          :key="modalData.cardData.id"
          :accomplishment="modalData.cardData"
          :isModal="true"
        />
        <!-- event -->
        <EventCard
          v-else-if="modalData.cardType === 'EventCard'"
          :key="modalData.cardData.id"
          :event="modalData.cardData"
          :visible="true"
          :isModal="true"
          :wasSpawnedByServer="serverCreated(modalData.activator)"
        />
      </b-col>
  </b-row>
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

  private serverCreated(activator:string){
    return activator == 'Server';
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/modals/CardModal.scss';
</style>
