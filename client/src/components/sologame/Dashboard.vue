<template>
  <div class="d-flex flex-column p-2 h-100 overflow-hidden solo-game">
    <EventModal
      v-if="state.activeRoundCardIndex >= 0"
      :event="state.roundEventCards[state.activeRoundCardIndex]"
      :visible="state.activeRoundCardIndex >= 0"
      @continue="handleEventContinue"
    />
    <div class="d-flex flex-shrink-1 m-2 mt-3">
      <SegmentedBar
        :min="0"
        :max="25"
        v-model="state.systemHealth"
        label="System Health"
        class="w-100"
        variant="green"
      />
    </div>
    <div class="d-flex flex-row flex-grow-1 overflow-hidden">
      <div class="d-flex flex-column flex-grow-1 overflow-hidden">
        <div class="d-flex flex-md-row flex-column flex-grow-1 overflow-hidden mh-50">
          <div class="cell-grow mw-35">
            <h4>Threshold</h4>
            <Threshold
              v-if="state.treatmentParams.thresholdInformation == 'known'"
              state="2"
            ></Threshold>
            <Threshold
              v-else-if="state.treatmentParams.thresholdInformation == 'unknown'"
              state="0"
            ></Threshold>
            <Threshold
              v-else-if="state.treatmentParams.thresholdInformation == 'range'"
              state="1"
            ></Threshold>
          </div>
          <div class="d-flex flex-md-column flex-row flex-grow-1 overflow-hidden mw-35">
            <div class="cell-grow">
              <div>
                <h4>Round</h4>

                <h5>
                  <span class="text-segmented"> {{ state.round }} </span>
                  <span v-if="state.treatmentParams.isKnownNumberOfRounds">
                    <span class="ml-2"> of </span>
                    <span class="text-segmented"> {{ state.maxRound }} </span>
                    <span class="ml-2"></span>
                  </span>
                </h5>
              </div>
            </div>
            <div class="cell-grow">
              <h4>Time remaining</h4>
              <div class="d-flex justify-content-center">
                <Clock :timeRemaining="state.timeRemaining" :size="3" />
              </div>
            </div>
          </div>
          <div class="cell-grow mw-35">
            <h4>This Round's Events</h4>
            <Deck :events="state.roundEventCards" />
          </div>
        </div>
        <div class="d-flex flex-md-row flex-column flex-grow-1 overflow-hidden mh-50">
          <div class="cell-grow mw-50">
            <h4>Points</h4>
            <SegmentedBar
              :min="0"
              :max="25"
              v-model="state.player.points"
              class="mb-3"
              size="md"
              variant="yellow"
            />
            <h4>Resources</h4>
            <SegmentedBar
              :min="0"
              :max="15"
              v-model="state.player.resources"
              variant="blue"
              size="md"
            />
          </div>
          <div class="cell-grow mw-50">
            <Investment :state="state" @invest="handleInvest" />
          </div>
        </div>
      </div>
      <div class="cell-shrink mw-25" style="min-width: 25%; padding: 0.5em">
        <h4>All Events</h4>
        <Deck v-if="state.treatmentParams.isEventDeckKnown" :events="state.eventCardDeck" />
        <div v-else class="d-flex flex-column h-75 align-items-center justify-content-center">
          <h1 class="text-danger mb-3"><b-icon icon="eye-slash-fill" /></h1>
          <h4 class="text-danger display-5">UNAVAILABLE</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, Prop } from "vue-property-decorator";
import { SoloGameRequestAPI } from "@port-of-mars/client/api/sologame/request";
import { SoloGameClientState } from "@port-of-mars/shared/sologame";
import EventCard from "@port-of-mars/client/components/sologame/EventCard.vue";
import EventModal from "@port-of-mars/client/components/sologame/EventModal.vue";
import HealthBar from "@port-of-mars/client/components/sologame/HealthBar.vue";
import SegmentedBar from "@port-of-mars/client/components/sologame/SegmentedBar.vue";
import Deck from "@port-of-mars/client/components/sologame/Deck.vue";
import Investment from "@port-of-mars/client/components/sologame/Investment.vue";
import Clock from "@port-of-mars/client/components/sologame/Clock.vue";
import Threshold from "@port-of-mars/client/components/sologame/Threshold.vue";

@Component({
  name: "sologame",
  components: {
    EventCard,
    Deck,
    HealthBar,
    SegmentedBar,
    Investment,
    EventModal,
    Clock,
    Threshold,
  },
})
export default class Dashboard extends Vue {
  @Inject() readonly api!: SoloGameRequestAPI;
  @Prop() state!: SoloGameClientState;

  handleInvest(investment: number) {
    this.api.invest(investment);
    // TODO: add boundary case (try-catch?) for if investment doesn't go through
  }

  handleEventContinue() {
    this.api.eventContinue();
  }
}
</script>

<style lang="scss"></style>
