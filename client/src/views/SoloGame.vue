<template>
  <div class="d-flex flex-column backdrop p-2 h-100 overflow-hidden">
    <div class="d-flex flex-shrink-1 m-2 mt-3">
      <SegmentedBar :min="0" :max="25" v-model="state.systemHealth" class="w-100" />
    </div>
    <div class="d-flex flex-row flex-grow-1 overflow-hidden">
      <div class="d-flex flex-column flex-grow-1 overflow-hidden">
        <div class="d-flex flex-md-row flex-column flex-grow-1 overflow-hidden">
          <div class="cell-grow">thresholds</div>
          <div class="d-flex flex-md-column flex-row flex-grow-1 overflow-hidden">
            <div class="cell-grow">
              <div>
                <h4>Round</h4>
                <p>
                  {{ state.round }}
                  <span v-if="state.treatmentParams.isKnownNumberOfRounds">
                    of {{ state.maxRound }}
                  </span>
                  <span v-else></span>
                </p>
              </div>
            </div>
            <div class="cell-grow">Time remaining: {{ state.timeRemaining }}</div>
          </div>
          <div class="cell-grow">
            <Deck :events="state.roundEventCards" />
          </div>
        </div>
        <div class="d-flex flex-md-row flex-column flex-grow-1 overflow-hidden">
          <div class="cell-grow">
            <h5>TOTAL POINTS: {{ state.player.points }}</h5>
            <h5>RESOURCES AVAILABLE: {{ state.player.resources }}</h5>
          </div>
          <div class="cell-grow">
            <Investment :state="state" @invest="handleInvest" />
          </div>
        </div>
      </div>
      <div class="cell-shrink mw-25">
        <Deck v-if="state.treatmentParams.isEventDeckKnown" :events="state.eventCardDeck" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, Provide } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { SoloGameRequestAPI } from "@port-of-mars/client/api/sologame/request";
import { applySoloGameServerResponses } from "@port-of-mars/client/api/sologame/response";
import { EventCardData, SOLO_ROOM_NAME } from "@port-of-mars/shared/sologame";
import EventCard from "@port-of-mars/client/components/sologame/EventCard.vue";
import HealthBar from "@port-of-mars/client/components/sologame/HealthBar.vue";
import SystemHealth from "@port-of-mars/client/components/game/static/systemhealth/SystemHealth.vue";
import SegmentedBar from "@port-of-mars/client/components/global/SegmentedBar.vue";
import Deck from "@port-of-mars/client/components/sologame/Deck.vue";
import Investment from "@port-of-mars/client/components/sologame/Investment.vue";

export interface SoloGameState {
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
}

@Component({
  name: "sologame",
  components: {
    EventCard,
    Deck,
    HealthBar,
    SystemHealth,
    SegmentedBar,
    Investment,
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
    activeRoundCardIndex: 0,
    canInvest: true,
  };

  handleInvest(investment: number) {
    this.api.invest(investment);
    // TODO: add boundary case (try-catch?) for if investment doesn't go through
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
  background-color: $dark-shade-75;
  border: 0.2rem solid $light-shade-25;
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

@keyframes glowing {
  0% {
    box-shadow: 0 0 0px #2ba805;
  }
  50% {
    box-shadow: 0 0 15px #49e819;
  }
  100% {
    box-shadow: 0 0 0px #2ba805;
  }
}

.glowing-shadow {
  box-shadow: 0 0 10px #28a745;
  animation: glowing 1s infinite;
  transition: box-shadow 0.5s ease-in-out;
}
</style>
