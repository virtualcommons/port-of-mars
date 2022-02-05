<template>
  <b-container
    fluid
    style="border: .125rem solid var(--light-shade); background-color: var(--dark-shade)"
    class="p-0 mx-0 mb-2"
    v-if="visible"
  >
    <b-row align-v="center" class="w-100 mx-0 mt-2 p-0 text-center">
      <!-- Event name | Active event indicator -->
      <b-col>
        <b-button
          squared
          block
          class="p-2 text-center"
          style="background-color: var(--light-shade); color: black"
          v-b-modal="eventModalId"
        >
          {{ event.name }}
        </b-button>
        <b-badge v-if="showActiveIndicator" variant="success">
          Active
        </b-badge>
      </b-col>
      <!-- Equal-width columns that span multiple lines: https://bootstrap-vue.org/docs/components/layout#comp-ref-b-col -->
      <div class="w-100"></div>

      <b-col class="w-100 p-3 m-0 text-center">
        <p>{{ event.effect !== "" ? event.effect : "No special effect" }}</p>
      </b-col>

      <div class="w-100"></div>

      <b-col class="w-100 pb-3 m-0 text-center">
        <p>
          Duration:
          <template v-if="event.duration > 1">
            <b>{{ event.elapsed }}</b> of
          </template>
          <b>{{ event.duration }}</b> Round(s)
        </p>
      </b-col>
    </b-row>
    <!-- FIXME: set prop -->
    <b-modal
      :id="eventModalId"
      centered
      no-stacking
      hide-header
      hide-footer
      body-bg-variant="dark"
      size="lg"
    >
      <EventModal :modalData="event" :showActiveIndicator="showActiveIndicator"></EventModal>

      <div class="w-100"></div>

      <b-row class="w-100 mx-auto my-4 text-center" v-if="wasSpawnedByServer">
        <b-col v-if="requiresInteraction">
          <b-button squared @click="$bvModal.hide(eventModalId)" variant="outline-light"
            >Interact</b-button
          >
        </b-col>
        <b-col v-else>
          <b-button squared @click="readyUp" variant="outline-light">Continue</b-button>
        </b-col>
      </b-row>
    </b-modal>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue, Watch } from "vue-property-decorator";
import { EventClientView, MarsEventData, Phase } from "@port-of-mars/shared/types";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import EventModal from "@port-of-mars/client/components/game/modals/EventModal.vue";

@Component({
  components: { EventModal }
})
export default class EventCard extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  @Prop({
    default: () => ({
      id: undefined,
      duration: undefined,
      elapsed: undefined,
      name: undefined,
      flavorText: undefined,
      effect: undefined
    })
  })
  event!: MarsEventData;

  @Prop({ default: false })
  visible!: boolean;

  @Prop({ default: false })
  active!: boolean;

  @Prop({ default: 0, required: false })
  timestamp!: number;

  //determining which type of events require which interactions
  eventNoChangeViews: Array<EventClientView> = ["NO_CHANGE", "AUDIT", "DISABLE_CHAT"];

  //if the modal was spawned by the server, show the option buttons
  get wasSpawnedByServer() {
    if (this.currentEvent) {
      return this.currentPhase === Phase.events && this.currentEvent.id === this.event.id;
    } else return false;
  }

  get currentEvent() {
    return this.$tstore.getters.currentEvent;
  }

  get eventModalId() {
    return `event-modal-${this.event.id}-${this.timestamp}`;
  }

  get currentPhase() {
    return this.$tstore.state.phase;
  }

  get showActiveIndicator() {
    return this.active && this.currentPhase === Phase.events;
  }

  get requiresInteraction() {
    return !this.eventNoChangeViews.includes(this.event.clientViewHandler);
  }

  readyUp() {
    this.api.setPlayerReadiness(true);
    this.$bvModal.hide(this.eventModalId);
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/phases/events/EventCard.scss";
@import "~animate.css/source/attention_seekers/pulse.css";
</style>
