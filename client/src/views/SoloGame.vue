<template>
  <!-- extremely basic layout w/ BS grid + flex -->
  <!-- likely need to start over but serves as an example of some css/flex concepts -->
  <b-container fluid class="h-100 w-100 d-flex flex-column">
    <b-row class="w-100 flex-shrink-1 p-2" no-gutters>
      <b-col cols="12" class="content-container">SYSTEM HEALTH: {{ state.systemHealth }}</b-col>
    </b-row>
    <b-row class="w-100 flex-grow-1" no-gutters>
      <b-col cols="12">
        <b-row class="w-100 p-2" no-gutters>
          <b-col cols="6" class="content-container">POINTS: {{ state.player.points }}</b-col>
          <b-col cols="6" class="content-container">TIMER: {{ state.timeRemaining }}</b-col>
        </b-row>
        <b-row class="w-100 p-2" no-gutters>
          <b-col cols="4" class="content-container">EVENTS: {{ state.roundEventCards }} </b-col>
          <b-col cols="8" class="content-container">DECK: {{ state.eventCardDeck }}</b-col>
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
}

@Component({
  name: "sologame",
})
export default class Game extends Vue {
  @Inject() readonly $client!: Client;
  @Provide() private api: SoloGameRequestAPI = new SoloGameRequestAPI();
  hasApi: boolean = false;

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
  };

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
