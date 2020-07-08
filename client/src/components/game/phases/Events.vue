<template>
  <div class="c-events container tour-event">
    <div class="wrapper row">
      <div class="event-deck col-4 tour-event-deck">
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
import { Vue, Component, Watch, Inject } from 'vue-property-decorator';
import EventCard from './events/EventCard.vue';
import EventContainer from './events/events/EventContainer.vue';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import { MarsEventData, Phase } from '@port-of-mars/shared/types';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';

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

  updated() {
    let elem = this.$el.querySelector('.event-scroll');
    if (elem) {
      elem!.scrollTop = elem!.scrollHeight;
    }
  }

  @Watch('eventsProcessed')
  onEventsProcessedChange(val: any, oldVal: any) {
    if (this.selectedView === 'Active Accomplishments') {
      this.selectedView = 'Event Deck';
    }
  }

  //Open an event modal when a new card comes in
  @Watch('currentEvent',{immediate:true})
  onNewEvent(event:any){
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

  // NOTE :: EVENT SPECIFIC

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

  get eventNumber(): number {
    return this.$tstore.state.marsEventsProcessed + 1;
  }

  // NOTE :: VIEW HANDLING

  private switchView(view: string) {
    this.selectedView = view;
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
