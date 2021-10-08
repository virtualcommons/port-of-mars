<template>
  <b-container fluid class="h-100 m-0 p-0">
    <b-row
      class="w-100 tour-trade-player tour-request-resources tour-offer-resources tour-send-trade"
      align="center"
    >
      <b-col cols="8">
        <TradeRequest></TradeRequest>
      </b-col>
      <b-col cols="4">
        <b-button-group class="w-100 mb-2">
          <b-button squared @click="switchView(false)" variant="primary" :pressed="!selectedView">
            Accomplishments
          </b-button>
          <b-button squared @click="switchView(true)" variant="primary" :pressed="selectedView">
            Inventory
          </b-button>
        </b-button-group>
        <b-row v-if="selectedView === true" class="inventory-wrapper">
          <Inventory :isSelf="true" />
        </b-row>
        <b-row v-if="selectedView === false" class="accomplishment-cards-wrapper">
          <AccomplishmentCard
            v-for="accomplishment in activeAccomplishments"
            :key="accomplishment.id"
            :accomplishment="accomplishment"
            :showDescription="false"
          />
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Vue, Prop } from "vue-property-decorator";
import { TradeRequestModalData } from "@port-of-mars/shared/game/client/modals";
import TradeRequest from "@port-of-mars/client/components/game/phases/trade/TradeRequest.vue";
import Inventory from "@port-of-mars/client/components/game/Inventory.vue";
import AccomplishmentCard from "@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue";
import { TutorialAPI } from "../../../api/tutorial/request";

@Component({
  components: {
    TradeRequest,
    Inventory,
    AccomplishmentCard
  }
})
export default class TradeRequestModal extends Vue {
  @Inject() readonly api!: TutorialAPI;
  selectedView: boolean = false;

  switchView(view: boolean) {
    this.selectedView = view;
  }

  get activeAccomplishments() {
    return this.$tstore.getters.player.accomplishments.purchasable;
  }
}
</script>

<style lang="scss" scoped>
.inventory-wrapper {
  flex: 1;
  width: 100%;
  overflow-y: hidden;
}

.inventory {
  width: 100%;
  overflow-y: auto;
}

.accomplishment-cards-wrapper {
  flex: 1;
  width: 100%;
  padding: 0.5rem;
  background-color: $light-shade-05;
  overflow-y: auto;
}

.accomplishment-cards {
  width: 100%;
  @include make-column-and-top;
  overflow-y: auto;
}
</style>
