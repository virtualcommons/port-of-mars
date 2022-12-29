<template>
  <b-container fluid class="h-100 m-0 p-0">
    <div v-if="purchasedAccomplishments.length < 1">
      <EventNoChange eventView="EFFORTS_WASTED_NO_ACCOMPLISHMENTS"></EventNoChange>
    </div>
    <div v-else class="h-100 w-100">
      <b-row align-v="stretch" align-h="center" class="h-25 p-2">
        <b-col class="text-center" align-self="center">
          <p class="pb-1">
            <i>{{ marsEvent.flavorText }}</i>
          </p>
          <p v-if="!completed">
            <strong>Discard one Accomplishment that you have already purchased.</strong>
          </p>
          <p v-else>
            <strong>You chose to discard:</strong>
          </p>
        </b-col>
      </b-row>
      <b-row align-v="stretch" align-h="center" class="h-75 p-2">
        <b-col v-if="!completed">
          <div class="h-100 w-100 p-2 scrollable">
            <AccomplishmentCard
              v-for="accomplishment in purchasedAccomplishments"
              :key="accomplishment.id"
              :accomplishment="accomplishment"
              :type="cardType"
              @discardPurchased="stageDiscard(accomplishment)"
            ></AccomplishmentCard>
          </div>
        </b-col>
        <b-col v-else>
          <div class="h-100 w-100 p-2 scrollable">
            <AccomplishmentCard
              :accomplishment="selectedPurchasedAccomplishment"
            ></AccomplishmentCard>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import AccomplishmentCard from "@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue";
import EventNoChange from "@port-of-mars/client/components/game/phases/events/events/EventNoChange.vue";
import { AccomplishmentCardType } from "@port-of-mars/client/types/cards";
import { AccomplishmentData, MarsEventData, RESEARCHER } from "@port-of-mars/shared/types";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import _ from "lodash";

@Component({
  components: {
    AccomplishmentCard,
    EventNoChange
  }
})
export default class AccomplishmentsSelectPurchased extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  selectedPurchasedAccomplishment: AccomplishmentData = {
    id: -1,
    role: RESEARCHER,
    label: "",
    flavorText: "",
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0,
    systemHealth: 0,
    victoryPoints: 0,
    effect: ""
  };

  get marsEvent(): MarsEventData {
    return this.$tstore.getters.currentEvent!;
  }

  get cardType() {
    return AccomplishmentCardType.discard;
  }

  get purchasedAccomplishments() {
    return this.$tstore.getters.player.accomplishments.purchased;
  }

  get completed() {
    return this.selectedPurchasedAccomplishment.id !== -1;
  }

  stageDiscard(accomplishment: AccomplishmentData) {
    this.selectedPurchasedAccomplishment = accomplishment;
    this.api.stageDiscardOfPurchasedAccomplishment(accomplishment.id);
  }
}
</script>

<style lang="scss" scoped>
</style>
