<template>
  <b-container class="h-100 m-0 p-0 tour-event" fluid>
    <b-row  class="h-100 w-auto flex-shrink-1">
      <b-col cols="4" class="h-100 flex-column justify-content-start align-items-center
      partition tour-event-deck">
        <!-- events | active accomplishments -->
        <b-row class="header-banner w-100 mx-auto align-items-center flex-shrink-0">
          <b-col cols="6" class="h-100 w-100 text-center my-auto">
            <button
              :class="selectedView === 'Event Deck' ? 'selected' : ''"
              @click="switchView('Event Deck')"
              class="h-100 w-100 p-0 m-0"
            >
              <p class="my-auto">Event Deck</p>
            </button>
          </b-col>
          <b-col cols="6" class="h-100 w-100 text-center align-content-center">
            <button
              :class="selectedView === 'Active Accomplishments' ? 'selected' : ''"
              @click="switchView('Active Accomplishments')"
              class="h-100 w-100 p-0 m-0"
            >
              <p class="my-auto">Accomplishments</p>
            </button>
          </b-col>
        </b-row>
        <b-row v-if="selectedView === 'Event Deck'" class="mx-auto mt-3 p-3 content-wrapper">
            <EventCard
              v-for="(event, index) in eventsForTheRound"
              :key="index"
              :active="eventActive(index)"
              :event="event"
              :visible="eventVisible(index)"
              class="my-2"
            />
        </b-row>
        <b-row
          v-if="selectedView === 'Active Accomplishments'"
          class="mx-auto mt-3 p-3 content-wrapper"
        >
            <AccomplishmentCard
              v-for="accomplishment in accomplishmentCards"
              :key="accomplishment.id"
              :accomplishment="accomplishment"
              :showDescription="false"
            />
        </b-row>
      </b-col>
      <b-col class="h-100 w-auto tour-active-events" cols="8">
        <b-row class="header-banner mx-auto flex-shrink-1">
          <p class="m-auto">
            {{ eventTitle }}
          </p>
        </b-row>
        <b-row class="mx-auto mt-3 p-3 content-wrapper">
            <EventContainer :key="eventNumber" :event="currentEvent"/>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {Component, Inject, Vue, Watch} from 'vue-property-decorator';
import EventCard from './events/EventCard.vue';
import EventContainer from './events/events/EventContainer.vue';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import {MarsEventData, Phase} from '@port-of-mars/shared/types';
import {GameRequestAPI} from '@port-of-mars/client/api/game/request';

@Component({
  components: {
    EventCard,
    EventContainer,
    AccomplishmentCard,
  },
})
export default class Events extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  private selectedView: string = 'Event Deck';

  // NOTE :: LIFECYCLE HOOKS & WATCHERS

  get currentEvent(): MarsEventData {
    return this.$store.getters.currentEvent;
  }

  get eventTitle() {
    return this.currentEvent
      ? `Active Event #${this.eventsProcessed + 1}: ${this.currentEvent.name}`
      : `No Active Event`;
  }

  get eventsProcessed(): number {
    return this.$tstore.state.marsEventsProcessed;
  }

  // NOTE :: EVENT SPECIFIC

  get eventNumber(): number {
    return this.$tstore.state.marsEventsProcessed + 1;
  }

  get eventsForTheRound() {
    return this.$tstore.state.marsEvents;
  }

  get accomplishmentCards(): any {
    return this.$tstore.getters.player.accomplishments.purchasable;
  }

  updated() {
    let elem = this.$el.querySelector('.event-scroll');
    if (elem) {
      elem!.scrollTop = elem!.scrollHeight;
    }
  }

  // NOTE :: VIEW HANDLING

  @Watch('eventsProcessed')
  onEventsProcessedChange(val: any, oldVal: any) {
    if (this.selectedView === 'Active Accomplishments') {
      this.selectedView = 'Event Deck';
    }
  }

  // NOTE :: EVENT CARDS

  //Open an event modal when a new card comes in
  @Watch('currentEvent', {immediate: true})
  onNewEvent(event: any) {
    this.api.setModalVisible({
      type: 'CardModal',
      data: {
        activator: 'Server',
        title: 'Event',
        content: 'This is a description of the Event.',
        cardType: 'EventCard',
        cardData: event,
        confirmation: false,
      },
    });
  }

  private switchView(view: string) {
    this.selectedView = view;
  }

  private eventVisible(index: number) {
    return (
      this.$tstore.state.phase !== Phase.events || index <= this.eventsProcessed
    );
  }

  // NOTE :: ACCOMPLISHMENT CARDS

  private eventActive(ind: number) {
    return (
      this.$tstore.state.phase === Phase.events && ind == this.eventsProcessed
    );
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/Events.scss';
</style>
