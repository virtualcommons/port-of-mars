<template>
  <b-row class="h-100 w-100 m-0 p-0">
    <!--                   |
          Game Information | Instructions / Active Events
                           |                             -->
    <!-- Game Information -->
    <b-col class="w-100 m-0 p-0 tour-phase" cols="4">
      <GameInformation/>
    </b-col>
    <!-- Instructions / Active Events -->
    <b-col class="d-flex flex-column h-100 w-100 m-0 p-0 justify-content-center" cols="8">
      <b-row class="h-auto w-100 mx-0 mb-2 p-0">
        <HUDRightButtons/>
      </b-row>
      <b-row class="w-100 flex-grow-1"
             style="background-color: rgba(241, 224, 197, 0.05)"
      >
        <!-- Phase Instructions View -->
        <PhaseInstructions v-show="currentView === view.PhaseInformation"/>
        <!-- active events for a given round -->
        <b-col v-show="currentView === view.ActiveEvents" class="w-100"
        >
          <b-row class="w-100 flex-grow-1 justify-content-center"

          >
            <p v-if="eventsForTheRound.length === 0" class="text-center m-3">
              No Active Events
            </p>

            <div class="position-absolute ml-4 my-3" style="overflow-y: auto; overflow-x: hidden;
              max-height: 90%; max-width: 95%"
            >
              <EventCard
                v-for="(event, index) in eventsForTheRound"
                :key="index"
                :event="event"
                :visible="eventVisible(index)"
              />
            </div>


          </b-row>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import HUDRightButtons from '@port-of-mars/client/components/game/HUDRightButtons.vue';
import GameInformation from './static/panels/GameInformation.vue';
import PhaseInstructions from './static/panels/PhaseInstructions.vue';
import EventCard from '@port-of-mars/client/components/game/phases/events/EventCard.vue';
import {Phase} from '@port-of-mars/shared/types';
import {HUDRightView} from '@port-of-mars/shared/game/client/panes';

@Component({
  components: {
    HUDRightButtons,
    GameInformation,
    PhaseInstructions,
    EventCard,
  },
})
export default class HUDRight extends Vue {
  get view() {
    return HUDRightView;
  }

  get currentView() {
    return this.$tstore.state.userInterface.hudRightView;
  }

  get eventsForTheRound() {
    return this.$tstore.state.marsEvents;
  }

  get eventsProcessed(): number {
    return this.$tstore.state.marsEventsProcessed;
  }

  private eventVisible(index: number) {
    return (
      this.$tstore.state.phase !== Phase.events || index <= this.eventsProcessed
    );
  }
}
</script>
