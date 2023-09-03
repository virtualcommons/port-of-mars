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
      />
    </div>
    <div class="d-flex flex-row flex-grow-1 overflow-hidden">
      <div class="d-flex flex-column flex-grow-1 overflow-hidden">
        <div class="d-flex flex-md-row flex-column flex-grow-1 overflow-hidden mh-50">
          <div class="cell-grow mw-35">thresholds</div>
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
            <SegmentedBar :min="0" :max="25" v-model="state.player.points" class="mb-3" />
            <h4>Resources</h4>
            <SegmentedBar :min="0" :max="15" v-model="state.player.resources" />
          </div>
          <div class="cell-grow mw-50">
            <Investment :state="state" @invest="handleInvest" />
          </div>
        </div>
      </div>
      <div class="cell-shrink mw-25" style="min-width: 25%; padding: 0.5em;">
        <h4>All Events</h4>
        <Deck v-if="state.treatmentParams.isEventDeckKnown" :events="state.eventCardDeck" />
        <div id="event-bg" v-else>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, Provide } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { SoloGameRequestAPI } from "@port-of-mars/client/api/sologame/request";
import { applySoloGameServerResponses } from "@port-of-mars/client/api/sologame/response";
import { EventCardData, SoloGameStatus, SOLO_ROOM_NAME } from "@port-of-mars/shared/sologame";
import EventCard from "@port-of-mars/client/components/sologame/EventCard.vue";
import EventModal from "@port-of-mars/client/components/sologame/EventModal.vue";
import HealthBar from "@port-of-mars/client/components/sologame/HealthBar.vue";
import SegmentedBar from "@port-of-mars/client/components/global/SegmentedBar.vue";
import Deck from "@port-of-mars/client/components/sologame/Deck.vue";
import Investment from "@port-of-mars/client/components/sologame/Investment.vue";
import Clock from "@port-of-mars/client/components/sologame/Clock.vue";

export interface SoloGameState {
  status: SoloGameStatus;
  timeRemaining: number;
  systemHealth: number;
  twoCardThreshold?: number;
  threeCardThreshold?: number;
  maxRound?: number;
  round: number;
  treatmentParams: {
    isKnownNumberOfRounds: boolean;
    isEventDeckKnown: boolean;
    thresholdInformation: "unknown" | "range" | "known";
  };
  player: {
    resources: number;
    points: number;
  };
  eventCardDeck?: Array<EventCardData>;
  roundEventCards: Array<EventCardData>;
  activeRoundCardIndex: number;
  canInvest: boolean;
  isRoundTransitioning: boolean;
}

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
  },
})
export default class SoloGame extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() private api: SoloGameRequestAPI = new SoloGameRequestAPI();
  hasApi: boolean = false;

  // pendingSystemHealthInvestment = 0;

  // FIXME: move this to a vuex store after splitting up the multiplayer game and
  // onboarding/etc. stores
  state: SoloGameState = {
    status: "incomplete",
    timeRemaining: 0,
    systemHealth: 0,
    round: 0,
    treatmentParams: {
      isKnownNumberOfRounds: false,
      isEventDeckKnown: false,
      thresholdInformation: "unknown",
    },
    player: {
      resources: 0,
      points: 0,
    },
    roundEventCards: [],
    activeRoundCardIndex: -1,
    canInvest: true,
    isRoundTransitioning: false,
  };

  handleInvest(investment: number) {
    this.api.invest(investment);
    // TODO: add boundary case (try-catch?) for if investment doesn't go through
  }

  handleEventContinue() {
    this.api.eventContinue();
  }

  async created() {
    this.api.room?.leave();
    this.api.room = await this.$client.create(SOLO_ROOM_NAME);
    applySoloGameServerResponses(this.api.room, this);
  }

  destroyed() {
    if (this.api.room) this.api.room.leave();
  }
}
</script>

<style lang="scss">
.cell {
  background-color: rgba(255, 255, 255, 0.025);
  border-radius: 0.25rem;
  overflow: scroll;
  margin: 0.5rem;
  padding: 0.5rem;
}

.cell-grow {
  @extend .cell;
  flex-grow: 1;
  flex-shrink: 0;
}

.cell-shrink {
  @extend .cell;
  flex-grow: 0;
  flex-shrink: 1;
}

.mw-25 {
  max-width: 25%;
}

.mw-35 {
  max-width: 35%;
}

.mw-50 {
  max-width: 50%;
}

.mh-50 {
  max-height: 50%;
}

@keyframes glowing {
  0% {
    box-shadow: 0 0 0px $success;
  }
  50% {
    box-shadow: 0 0 15px $success;
  }
  100% {
    box-shadow: 0 0 0px $success;
  }
}

.glowing-shadow {
  box-shadow: 0 0 10px $success;
  animation: glowing 1s infinite;
  transition: box-shadow 0.5s ease-in-out;
}

.custom-font {
  font-family: "DSEG 14 Regular";
}

#event-bg {
  min-height: 90%;
  background-size: contain;
  overflow: hidden;
  background-size: auto 100%;
  background-position: relative;
  box-shadow: inset 0 0 0.3em 0.3em #000;
  background: url("../assets/images/broken-screen.jpg") no-repeat;
}

</style>