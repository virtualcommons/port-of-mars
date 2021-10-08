<template>
  <b-container
    fluid
    :class="isModal ? 'border: none' : 'mb-2'"
    class="p-0 mx-0"
    v-if="visible"
    style="border: .125rem solid var(--light-shade)"
  >
    <b-row
      align-v="center"
      class="w-100 mx-0 mt-2 p-0 text-center"
      style="background-color: var(--dark-shade)"
    >
      <!-- Event name | Active event indicator -->
      <b-col style="cursor: pointer" @click="setModalData">
        <h5 class="p-2 text-center" style="background-color: var(--light-shade); color: black">
          {{ event.name }}
        </h5>
        <font-awesome-icon
          :icon="['far', 'dot-circle']"
          class="icontwo animated pulse infinite"
          size="lg"
          v-if="showActiveIndicator"
        />
      </b-col>
      <!-- Equal-width columns that span multiple lines: https://bootstrap-vue.org/docs/components/layout#comp-ref-b-col -->
      <div class="w-100"></div>
      <!-- </b-row> -->

      <!-- Event description -->
      <!-- <b-row
      class="w-100 justify-content-center mx-auto flex-grow-1"
      :class="isModal ? 'pt-4 px-3' : 'p-3'"
      style="background-color: var(--dark-shade)"
    > -->
      <b-col :class="isModal ? 'pt-4 px-3' : 'p-3'" class="w-100 p-0 m-0 text-center">
        <p>{{ event.effect !== "" ? event.effect : "No special effect" }}</p>
      </b-col>
      <div class="w-100"></div>
      <!-- </b-row> -->

      <!-- Event duration -->
      <!-- <b-row
      class="w-100 justify-content-center mx-auto"
      :class="isModal ? 'pt-1' : 'pb-3'"
      :style="'background-color: #221A1B'"
    > -->
      <b-col :class="isModal ? 'pt-1' : 'pb-3'" class="w-100 p-0 m-0 text-center">
        <p>
          Duration:
          <template v-if="event.duration > 1">
            <b>{{ event.elapsed }}</b> of
          </template>
          <b>{{ event.duration }}</b> Round(s)
        </p>
      </b-col>
      <div class="w-100"></div>
      <!-- </b-row> -->

      <!-- buttons -->
      <b-row class="w-100 mx-auto my-4" v-if="wasSpawnedByServer">
        <b-col v-if="requiresInteraction">
          <b-button squared @click="closeModal" variant="outline-secondary">Interact</b-button>
        </b-col>
        <b-col v-else>
          <b-button squared @click="readyUp" variant="outline-secondary">Continue</b-button>
        </b-col>
      </b-row>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue } from "vue-property-decorator";
import { EventClientView, MarsEventData, Phase } from "@port-of-mars/shared/types";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import { faDotCircle } from "@fortawesome/free-regular-svg-icons/faDotCircle";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";

library.add(faInfoCircle);
library.add(faDotCircle);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({})
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

  //if you're in a modal, show the modal view
  @Prop({ default: false })
  isModal!: boolean;

  //if the modal was spawned by the server, show the option buttons
  @Prop({ default: false }) wasSpawnedByServer!: boolean;
  //determining which type of events require which interactions
  eventNoChangeViews: Array<EventClientView> = ["NO_CHANGE", "AUDIT", "DISABLE_CHAT"];

  get phase() {
    return Phase;
  }

  get gamePhase() {
    return this.$store.state.phase;
  }

  get showActiveIndicator() {
    return this.active && this.gamePhase === this.phase.events;
  }

  get requiresInteraction() {
    return !this.eventNoChangeViews.includes(this.event.clientViewHandler);
  }

  closeModal() {
    this.api.setModalHidden();
    this.$root.$emit("bv::hide::modal", "gameModal");
  }

  readyUp() {
    this.api.setPlayerReadiness(true);
    this.api.setModalHidden();
    this.$root.$emit("bv::hide::modal", "gameModal");
  }

  setModalData(): void {
    this.$root.$emit("bv::show::modal", "gameModal");
    this.api.setModalVisible({
      type: "CardModal",
      data: {
        activator: "User",
        title: this.event.name,
        content: this.event.effect,
        cardType: "EventCard",
        cardData: this.event
      }
    });
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/phases/events/EventCard.scss";
@import "~animate.css/source/attention_seekers/pulse.css";
</style>
