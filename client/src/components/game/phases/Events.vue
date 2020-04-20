<template>
  <div class="c-events container tour-event">
    <div class="wrapper row">
      <div class="event-deck col-3 tour-event-deck">
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
      <div class="active-events tour-active-events"
        v-bind="{class: shouldShowAccomplishments ?
                'col-6 active-events-mid' : 'col-9 active-events-right'}">
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
      <div class="active-accomplishments col-3"
        v-if="shouldShowAccomplishments">
        <div class="topbar">
          <p class="title">Accomplishments</p>
        </div>
        <div class="outer-wrapper">
          <div class="wrapper event-scroll">
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

  get accomplishmentCards(): any {
      return this.$tstore.getters.player.accomplishments.purchasable;
  }

  get shouldShowAccomplishments(): boolean {
    return this.currentEvent.clientViewHandler == 'INFLUENCES_SELECT' ||
           this.currentEvent.clientViewHandler == 'INFLUENCES_DRAW';
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/Events.scss';
</style>
