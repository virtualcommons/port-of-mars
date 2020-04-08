<template>
  <div class="events-container tour-event">
    <div class="event-deck-container">
      <div class="section-text">
        <p>Event Deck</p>
      </div>
      <div class="events">
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
    <div class="active-event-container tour-active-events">
      <div class="section-text">
        <p>Active Events</p>
      </div>
      <div class="event-holder">
        <div class="event-info">
          <div class="event-title">
            <p>Event #{{ eventsProcessed + 1 }}- {{ currentEvent.name }}</p>
          </div>
        </div>
        <div class="event-action-wrapper">
          <EventContainer :event="currentEvent" :key="eventNumber" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import EventCard from './events/EventCard.vue';
import EventContainer from './events/events/EventContainer.vue';
import { MarsEventData, Phase } from '@port-of-mars/shared/types';

@Component({
  components: {
    EventCard,
    EventContainer,
  },
})
export default class Events extends Vue {
  get eventsForTheRound() {
    return this.$tstore.state.marsEvents;
  }

  get eventsProcessed(): number {
    return this.$tstore.state.marsEventsProcessed;
  }

  get currentEvent(): MarsEventData {
    const current: MarsEventData = this.$store.getters.currentEvent;

    const data = { name: current.name, visibility: true };
    //this.$store.commit('SET_EVENT_VISIBILITY', data);
    return current;
  }

  get eventNumber(): number {
    const eventNumber = this.$tstore.state.marsEventsProcessed + 1;
    return eventNumber;
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

  private updated(): any {
    const elem = this.$el.querySelector('.event-deck-container');
    elem!.scrollTop = elem!.scrollHeight;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/Events.scss';
</style>
