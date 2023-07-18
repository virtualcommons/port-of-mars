<!-- 
+-----------------------------------------------------------------+
|                      HEALTH BAR                                 |
+------------------------------------------------+----------------+
|+---------------++--------------++-------------+|                |
||               ||              ||             ||                |
||               ||  ROUND #     ||             ||                |
||  SYSTEM       ||  out of (?)  ||             ||                |
||  "DIAGNOSTICS"|+--------------+|   ROUND     ||                |
||  (thresholds) |+--------------+|   EVENTS    ||                |
||               ||   TIMER      ||             ||    DECK        |
||               ||              ||             ||                |
|+---------------++--------------++-------------+|                |
|+------------------++--------------------------+|                |
||                  ||                          ||                |
||     POINTS /     ||                          ||                |
||     RESOURCES    ||       INVEST INPUT       ||                |
||                  ||                          ||                |
||                  ||                          ||                |
|+------------------++--------------------------+|                |
+------------------------------------------------+----------------+

investment input - https://bootstrap-vue.org/docs/components/form-spinbutton
 -->

<template>
  <!-- extremely basic layout w/ BS grid + flex -->
  <!-- likely need to start over but serves as an example of some css/flex concepts -->
  <b-container fluid class="h-100 w-100 d-flex flex-column">
    <b-row class="w-100 flex-shrink-1 p-2" no-gutters>
      <b-col cols="12" class="content-container"
        >SYSTEM HEALTH: {{ state.systemHealth }}
        <b-col class="statusbar-outer" no-gutters>
          <b-col class="statusbar-inner" no-gutters></b-col>
          <b-img
            v-bind="systemHealthIconProps"
            :src="require(`@port-of-mars/client/assets/icons/systemHealth.svg`)"
            rounded="circle"
            left
            class="mr-1 mt-2"
            alt="System Health"
            contain
            height="50px"
            width="75px"
          />
        </b-col>
      </b-col>
    </b-row>
    <b-row class="w-100 flex-grow-1" no-gutters>
      <b-col cols="12">
        <b-row class="w-100 p-2" no-gutters>
          <b-col cols="6" class="content-container">
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
          </b-col>
          <b-col cols="6" class="content-container">TIMER: {{ state.timeRemaining }}</b-col>
        </b-row>
        <b-row class="w-100 p-2" no-gutters>
          <b-col cols="4" class="content-container">
            <div>  
              <div v-for="event in state.roundEventCards" :key="event.codeName">
                <EventCard :event="event" />
              </div>
            </div>
          </b-col>
          <b-col cols="8" class="content-container">
            <span v-if="state.treatmentParams.isEventDeckKnown">
                <div v-for="event in state.eventCardDeck" :key="event.codeName">
                  <Deck :event="event" />
                </div>
            </span>
            <span v-else>
              FALSE
            </span>
          </b-col>
          <b-row class="w-25 flex-shrink-1 p-2" no-gutters>
            <b-col cols="12" class="content-container">
              <b-form-spinbutton
                id="invest-input"
                v-model="pendingSystemHealthInvestment"
                min="0"
                :max="state.player.resources"
              >
                <template #decrement>
                  <b-icon-dash scale="1.00" color="#f1e0c5"></b-icon-dash>
                </template>
                <template #increment>
                  <b-icon-plus scale="1.00" color="#f1e0c5"></b-icon-plus>
                </template>
              </b-form-spinbutton>
              <p>{{ pendingSystemHealthInvestment }}</p>
              <b-button @click="handleInvestButtonClick" :disabled="!state.canInvest"
                >Invest in System Health</b-button>
            </b-col>
          </b-row>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component, Inject, Provide } from "vue-property-decorator";
import { Client } from "colyseus.js";
import { SoloGameRequestAPI } from "@port-of-mars/client/api/sologame/request";
import { applySoloGameServerResponses } from "@port-of-mars/client/api/sologame/response";
import { EventCardData, SOLO_ROOM_NAME } from "@port-of-mars/shared/sologame";
import EventCard from "@port-of-mars/client/components/sologame/EventCard.vue";
import Deck from "@port-of-mars/client/components/sologame/Deck.vue";

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
  },
})
export default class Game extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() private api: SoloGameRequestAPI = new SoloGameRequestAPI();
  hasApi: boolean = false;

  pendingSystemHealthInvestment = 0;

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

  handleInvestButtonClick() {
    //add how button behaves here
    this.api.invest(this.pendingSystemHealthInvestment);
    // TODO: add boundary case (try-catch?) for if investment doesn't go through
    this.pendingSystemHealthInvestment = 0;
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

<style lang="scss"></style>
