<template>
  <b-row class="h-100 w-100 m-0 p-0">
    <b-col class="d-flex flex-column w-100 py-2 light-shade-25-partition">
      <!-- events | active accomplishments -->

      <!-- toggle events or active accomplishments -->
      <b-row class="h-auto w-100 m-0 p-3 justify-content-center header">
        <b-col class="h-100 w-100 text-center my-auto p-0 mx-0" cols="6">
          <p class="m-auto">Active Events</p>
        </b-col>
      </b-row>
      <!-- event deck -->
      <b-row class="flex-grow-1 flex-column w-100 mx-auto my-3 p-2 backdrop">
        <b-col>
          <div class="h-100 p-2 scrollable sort-events" style="width: 95%">
            <EventCard
              v-for="(event, index) in eventsForTheRound"
              :key="index"
              :active="eventActive(index)"
              :event="event"
              :visible="eventVisible(index)"
              class="my-2"
              :currentEventModalId="currentEventModalId"
              :enableModal="true"
            ></EventCard>
          </div>
        </b-col>
      </b-row>
    </b-col>

    <b-col cols="8" class="d-flex flex-column h-100 w-100 py-2">
      <b-row class="h-auto w-100 mx-auto p-3 justify-content-center header">
        <p class="m-auto">
          {{ eventTitle }}
        </p>
      </b-row>
      <b-row align-v="stretch" class="flex-grow-1 w-100 my-3 mx-auto backdrop">
        <EventContainer :key="eventNumber" :event="currentEvent"></EventContainer>
      </b-row>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component, Inject, Vue, Watch } from "vue-property-decorator";
import EventCard from "./events/EventCard.vue";
import EventContainer from "./events/events/EventContainer.vue";
import AccomplishmentCard from "@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue";
import { MarsEventData, Phase } from "@port-of-mars/shared/types";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";

@Component({
  components: {
    EventCard,
    EventContainer,
    AccomplishmentCard
  }
})
export default class Events extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  selectedView: string = "Event Deck";
  currentEventModalId: string = "";

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
    let elem = this.$el.querySelector(".sort-events");
    if (elem) {
      elem!.scrollTop = elem!.scrollHeight;
    }
  }

  // NOTE :: VIEW HANDLING

  @Watch("eventsProcessed", { immediate: true })
  onEventsProcessedChange(val: any, oldVal: any) {
    if (this.selectedView === "Active Accomplishments") {
      this.selectedView = "Event Deck";
    }
  }

  // show event modal when there is a new event
  @Watch("currentEvent", { deep: true, immediate: true })
  onNewEvent(event: any) {
    console.log("new current event: ", event);
    let timestamp: number = Date.now();
    let modalId: string = `event-modal-${event.id}-${timestamp}`;
    this.currentEventModalId = modalId;
  }

  switchView(view: string) {
    this.selectedView = view;
  }

  eventVisible(index: number) {
    return this.$tstore.state.phase !== Phase.events || index <= this.eventsProcessed;
  }

  eventActive(index: number) {
    return this.$tstore.state.phase === Phase.events && index == this.eventsProcessed;
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
