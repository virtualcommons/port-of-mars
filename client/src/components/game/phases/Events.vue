<template>
  <b-row class="h-100 w-100 m-0 p-3">
    <b-col class="d-flex flex-column h-100 w-100 partition" cols="4">
      <!-- events | active accomplishments -->

      <!-- toggle events or active accomplishments -->
      <b-row class="h-auto w-100 m-0 p-3 justify-content-center" style="background-color: var(--main-brand)">
        <b-col class="h-100 w-100 text-center my-auto p-0 mx-0" cols="6">
          <button
            :class="selectedView === 'Event Deck' ? 'selected' : ''"
            class="h-100 w-100 p-0 m-0"
            @click="switchView('Event Deck')"
          >
            <p class="my-auto">Event Deck</p>
          </button>
        </b-col>
        <b-col class="h-100 w-100 text-center align-content-center" cols="6">
          <button
            :class="selectedView === 'Active Accomplishments' ? 'selected' : ''"
            class="h-100 w-100 p-0 m-0"
            @click="switchView('Active Accomplishments')"
          >
            <p class="my-auto">Accomplishments</p>
          </button>
        </b-col>
      </b-row>
      <!-- event deck -->
      <b-row v-if="selectedView === 'Event Deck'" class="flex-grow-1 w-100 mx-auto mt-3"
             style="background-color: var(--light-shade-05)"
      >
        <div class="position-absolute p-3" style="overflow-y: auto; overflow-x: hidden;
             height: 80%; width: 92%;"
        >
          <EventCard
            v-for="(event, index) in eventsForTheRound"
            :key="index"
            :active="eventActive(index)"
            :event="event"
            :visible="eventVisible(index)"
            class="my-2"
          />
        </div>
      </b-row>
      <!-- accomplishments -->
      <b-row
        v-if="selectedView === 'Active Accomplishments'"
        class="flex-grow-1 w-100 mx-auto mt-3 p-3"
        style="background-color: var(--light-shade-05)"
      >
        <div class="position-absolute p-3 w-100" style="overflow-y: auto; overflow-x: hidden;
            max-height: 75%; max-width: 85%;"
        >
          <AccomplishmentCard
            v-for="accomplishment in accomplishmentCards"
            :key="accomplishment.id"
            :accomplishment="accomplishment"
            :showDescription="false"
          />
        </div>
      </b-row>
    </b-col>

    <b-col class="d-flex flex-column h-100 w-100" cols="8">
      <b-row class="w-100 m-0 p-3 justify-content-center"
             style="background-color: var(--main-brand); color: var(--dark-shade)"
      >
        <p class="m-auto">
          {{ eventTitle }}
        </p>
      </b-row>
      <b-row class="flex-grow-1 w-100 mx-auto mt-3 p-3"
             style="background-color: var(--light-shade-05)"
      >
        <EventContainer :key="eventNumber" :event="currentEvent"/>
      </b-row>
    </b-col>
  </b-row>
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
  @Watch('currentEvent', { immediate: true })
  onNewEvent(event: any) {
    console.log("displaying new event: ", event);
    this.api.setModalVisible({
      type: 'CardModal',
      data: {
        activator: 'Server',
        title: event.name,
        content: event.effect,
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
button {
  border: 0.125rem solid $main-brand;
  color: $dark-shade;
  background-color: $main-brand;

  &:hover {
    color: $main-brand;
    background-color: $dark-shade;
  }
}

.buttons {
  height: 10%;
  flex-shrink: 0;
  width: 100%;
  margin-bottom: 0.5rem;
  @include make-center;
}

.selected {
  color: $main-brand;
  background-color: $dark-shade;
}
</style>
