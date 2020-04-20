<template>
  <div class="c-events container tour-event">
    <div class="wrapper row">
      <div
        v-if="shouldShowAccomplishments"
        class="event-deck col-4 tour-event-deck"
      >
        <div class="buttons">
          <button
            @click="switchView('Event Deck')"
            :class="selectedView === 'Event Deck' ? 'selected' : ''"
          >
            Event Deck
          </button>
          <button
            @click="switchView('Active Accomplishments')"
            :class="selectedView === 'Active Accomplishments' ? 'selected' : ''"
          >
            Accomplishments
          </button>
        </div>
        <div v-if="selectedView === 'Event Deck'" class="event-deck-wrapper">
          <div class="wrapper event-scroll">
            <EventCard
              class="event-container"
              v-for="(event, index) in eventsForTheRound"
              :key="index"
              :event="event"
              :visible="eventVisible(index)"
              :active="eventActive(index)"
            />
          </div>
        </div>
        <div
          v-if="selectedView === 'Active Accomplishments'"
          class="accomplishments-wrapper"
        >
          <div class="wrapper">
            <AccomplishmentCard
              class="cards"
              v-for="accomplishment in accomplishmentCards"
              :key="accomplishment.id"
              :accomplishment="accomplishment"
              :showDescription="false"
            />
          </div>
        </div>
      </div>
      <div v-else class="event-deck col-4 tour-event-deck">
        <div class="topbar">
          <p class="title">Active Accomplishments</p>
        </div>
        <div class="accomplishments-wrapper">
          <div class="wrapper">
            <AccomplishmentCard
              class="cards"
              v-for="accomplishment in accomplishmentCards"
              :key="accomplishment.id"
              :accomplishment="accomplishment"
              :showDescription="false"
            />
          </div>
        </div>
      </div>
      <div class="active-events tour-active-events col-8">
        <div class="topbar">
          <p class="title">
            {{ eventTitle }}
          </p>
        </div>
        <div class="outer-wrapper">
          <div class="wrapper">
            <EventContainer :event="currentEvent" :key="eventNumber" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import EventCard from './events/EventCard.vue';
import EventContainer from './events/events/EventContainer.vue';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import { MarsEventData, Phase } from '@port-of-mars/shared/types';

@Component({
  components: {
    EventCard,
    EventContainer,
    AccomplishmentCard,
  },
})
export default class Events extends Vue {
  private selectedView: string = 'Event Deck';

  // NOTE :: LIFECYCLE HOOKS

  updated(): any {
    const elem = this.$el.querySelector('.event-scroll');
    if (elem) {
      elem!.scrollTop = elem!.scrollHeight;
    }
  }

  // NOTE :: EVENT SPECIFIC

  get currentEvent(): MarsEventData {
    const current: MarsEventData = this.$store.getters.currentEvent;
    return current;
  }

  get eventTitle() {
    if (this.eventsProcessed && this.currentEvent) {
      return `Active Event #${this.eventsProcessed + 1}: ${
        this.currentEvent.name
      }`;
    }
    return `Active Event: None`;
  }

  get eventsProcessed(): number {
    return this.$tstore.state.marsEventsProcessed;
  }

  get eventNumber(): number {
    const eventNumber = this.$tstore.state.marsEventsProcessed + 1;
    return eventNumber;
  }

  // NOTE :: VIEW HANDLING

  private switchView(view: string) {
    this.selectedView = view;
  }

  get shouldShowAccomplishments(): boolean {
    return (
      this.currentEvent.clientViewHandler == 'INFLUENCES_SELECT' ||
      this.currentEvent.clientViewHandler == 'INFLUENCES_DRAW'
    );
  }

  // NOTE :: EVENT CARDS

  get eventsForTheRound() {
    return this.$tstore.state.marsEvents;
  }

  private eventVisible(index: number) {
    return (
      this.$tstore.state.phase !== Phase.events || index <= this.eventsProcessed
    );
  }

  private eventActive(ind: number) {
    return (
      this.$tstore.state.phase === Phase.events && ind == this.eventsProcessed
    );
  }

  // NOTE :: ACCOMPLISHMENT CARDS

  get accomplishmentCards(): any {
    return this.$tstore.getters.player.accomplishments.purchasable;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/Events.scss';
</style>
