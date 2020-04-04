<template>
    <div class="events-container">
        <div class="event-deck-container">
            <div class="section-text">
                <p>Event Deck</p>
            </div>
            <div class="events">
                <CardEvent
                    class="event-container"
                    v-for="(event, eventInd) in eventsForTheRound"
                    :event="event"
                    :visible="visible(eventInd)" :key="eventInd"
                    :active="active(eventInd)"
                />
            </div>

        </div>

        <div class="active-event-container">
            <div class="section-text">
                <p>Active Events</p>
            </div>

            <div class="event-holder">
                <div class="event-info">
                    <div class="event-title">
                        <p>Event #{{eventsProcessed+1}}- {{currentEvent.name}}</p>
                    </div>
                </div>

                <div class="event-action-wrapper">
                    <EventContainer :event="currentEvent" :key="eventNumber"/>
                </div>
            </div>

        </div>

    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import CardEvent from './events/CardEvent.vue';
import EventContainer from './events/events/EventContainer.vue';
import * as shared from '@port-of-mars/shared/types'

@Component({
  components: {
      CardEvent,
      EventContainer
  }
})
export default class Phase extends Vue {

    get eventsForTheRound() {
        return this.$tstore.state.marsEvents;
    }

    get eventsProcessed(): number {
        return this.$tstore.state.marsEventsProcessed;
    }

    get currentEvent(): shared.MarsEventData {
        const current: shared.MarsEventData = this.$store.getters.currentEvent;

        const data = { name: current.name, visibility: true };
        //this.$store.commit('SET_EVENT_VISIBILITY', data);
        return current;
    }

    get eventNumber(): number {
        const eventNumber = this.$tstore.state.marsEventsProcessed + 1;
        return eventNumber;
    }

    visible(ind: number) {
        return this.$tstore.state.phase !== shared.Phase.events || ind < this.eventsProcessed;
    }

    active(ind:number){
        return this.$tstore.state.phase === shared.Phase.events && ind == this.eventsProcessed;
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