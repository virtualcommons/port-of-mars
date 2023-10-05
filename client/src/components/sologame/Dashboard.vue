<template>
  <div class="d-flex flex-column p-2 h-100 overflow-hidden solo-game">
    <EventModal
      v-if="state.activeCardId >= 0"
      :event="activeCard"
      :visible="state.activeCardId >= 0"
      @continue="handleEventContinue"
    />
    <div class="d-flex flex-row flex-grow-1 overflow-hidden">
      <div class="d-flex flex-column flex-grow-1 overflow-hidden">
        <div class="d-flex flex-shrink-1 m-2 mt-3">
          <SegmentedBar
            :min="0"
            :max="25"
            :delta="pendingSystemHealthInvestment"
            v-model="state.systemHealth"
            label="System Health"
            class="flex-grow-1"
            variant="green"
          />
        </div>
        <div class="d-flex flex-md-row flex-column flex-grow-1 overflow-hidden mh-50">
          <div class="cell-grow mw-35">
            <div>
              <Threshold
                v-if="state.treatmentParams.thresholdInformation !== 'unknown'"
                :state="state"
              />
              <div v-else class="d-flex flex-column align-items-center justify-content-center">
                <h1 class="text-danger mb-3"><b-icon icon="eye-slash-fill" /></h1>
                <h4 class="text-danger text-center">THRESHOLDS UNAVAILABLE</h4>
              </div>
            </div>
          </div>
          <div class="cell-grow mw-35 d-flex flex-column justify-content-center">
            <h4 class="text-center">Time remaining</h4>
            <div class="d-flex justify-content-center">
              <Clock :timeRemaining="state.timeRemaining" :size="3" />
            </div>
          </div>
          <div class="cell-grow mw-25 d-flex flex-column justify-content-center">
            <div>
              <h4 class="text-center">Round</h4>
            </div>
            <div class="d-flex justify-content-center align-items-center">
              <div class="vfd-container p-2">
                <VFDNumberDisplay :digits="2" :value="state.round" variant="red" size="2" />
              </div>
              <h4 v-if="state.treatmentParams.isKnownNumberOfRounds" class="mx-2">/</h4>
              <div v-if="state.treatmentParams.isKnownNumberOfRounds" class="vfd-container p-2">
                <VFDNumberDisplay :digits="2" :value="state.maxRound" variant="red" size="2" />
              </div>
            </div>
          </div>
        </div>
        <div
          class="d-flex flex-md-row flex-column flex-grow-1 overflow-hidden mh-50"
          style="min-height: 18rem"
        >
          <div class="cell-grow mw-50 d-flex flex-column">
            <div>
              <h4>Points</h4>
              <SegmentedBar
                :min="0"
                :max="25"
                v-model="state.player.points"
                :delta="state.player.resources - pendingSystemHealthInvestment"
                class="mb-3"
                size="md"
                variant="yellow"
              />
            </div>
            <div>
              <h4>Available Resources</h4>
              <SegmentedBar
                :min="0"
                :max="15"
                v-model="state.player.resources"
                variant="blue"
                size="md"
              />
            </div>
          </div>
          <div class="cell-grow mw-50">
            <Investment
              :state="state"
              v-model="pendingSystemHealthInvestment"
              @invest="handleInvest"
            />
          </div>
        </div>
      </div>
      <div class="cell-shrink mw-25" style="min-width: 25%; padding: 0.5em">
        <h4>Events</h4>
        <Deck :events="state.visibleEventCards" @active-card-changed="handleActiveCardChange" />
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
import VFDNumberDisplay from "@port-of-mars/client/components/sologame/VFDNumberDisplay.vue";

@Component({
  components: {
    EventCard,
    Deck,
    HealthBar,
    SegmentedBar,
    Investment,
    EventModal,
    Clock,
    Threshold,
    VFDNumberDisplay,
  },
})
export default class Dashboard extends Vue {
  @Inject() readonly api!: SoloGameRequestAPI;
  @Prop() state!: SoloGameClientState;

  pendingSystemHealthInvestment = 0;

  get activeCard() {
    return this.state.visibleEventCards.find(card => card.deckCardId === this.state.activeCardId);
  }

  handleInvest(investment: number) {
    this.api.invest(investment);
  }

  handleEventContinue() {
    this.api.eventContinue();
  }

  handleActiveCardChange(el: HTMLElement) {
    // scroll to the new cards in play for a round
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }
}
</script>

<style lang="scss"></style>
