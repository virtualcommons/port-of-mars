<template>
  <div class="c-events container tour-event">
    <div class="wrapper row">
      <div class="event-deck col-4 tour-event-deck">
        <div class="topbar">
          <p class="title">Event Deck</p>
        </div>
        <div class="outer-wrapper">
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
      </div>
      <div class="active-events col-8 tour-active-events">
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

  get eventNumber(): number {
    const eventNumber = this.$tstore.state.marsEventsProcessed + 1;
    return eventNumber;
  }

  get currentEvent(): MarsEventData {
    const current: MarsEventData = this.$store.getters.currentEvent;
    // const data = { name: current.name, visibility: true };
    //this.$store.commit('SET_EVENT_VISIBILITY', data);
    return current;
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

  get eventTitle() {
    if (this.eventsProcessed && this.currentEvent) {
      return `Active Event #${this.eventsProcessed + 1}: ${
        this.currentEvent.name
      }`;
    }
    return `Active Event: None`;
  }

  private updated(): any {
    const elem = this.$el.querySelector('.event-scroll');
    elem!.scrollTop = elem!.scrollHeight;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/Events.scss';
</style>
