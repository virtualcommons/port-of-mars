<template>
  <div class="c-hud-right container">
    <div class="wrapper row">
      <div class="information col-5 tour-phase">
        <GameInformation />
      </div>
      <div class="views col-7">
        <HUDRightButtons />
        <div class="views-wrapper tour-phase-instructions tour-event-view">
          <!-- Phase Instructions View -->
          <PhaseInstructions v-show="currentView === view.PhaseInformation" />

          <!-- Active Events View -->
          <div
            v-show="currentView === view.ActiveEvents"
            class="active-events-view"
          >
            <div class="wrapper">
              <p class="empty" v-if="eventsForTheRound.length === 0">
                No Active Events
              </p>
              <EventCard
                v-for="(event, index) in eventsForTheRound"
                :key="index"
                :event="event"
                :visible="eventVisible(index)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import HUDRightButtons from '@port-of-mars/client/components/game/HUDRightButtons.vue';
import GameInformation from './static/panels/GameInformation.vue';
import PhaseInstructions from './static/panels/PhaseInstructions.vue';
import EventCard from '@port-of-mars/client/components/game/phases/events/EventCard.vue';
import { Phase } from '@port-of-mars/shared/types';
import { HUDRightView } from '@port-of-mars/shared/game/client/panes';

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

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/HUDRight.scss';
</style>
