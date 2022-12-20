<template>
  <b-container fluid no-gutters class="h-100">
    <b-row no-gutters class="w-100" align="center">
      <b-col cols="8">
        <TradeRequest></TradeRequest>
      </b-col>
      <b-col cols="4">
        <b-button-group class="w-100 mb-2">
          <b-button
            squared
            @click="switchView(false)"
            :variant="switchView == false ? 'secondary' : 'outline-secondary'"
          >
            Accomplishments
          </b-button>
          <b-button
            squared
            @click="switchView(true)"
            :variant="switchView == true ? 'secondary' : 'outline-secondary'"
          >
            Inventory
          </b-button>
        </b-button-group>
        <b-row v-if="selectedView === true" class="w-100 my-2 backdrop">
          <div class="w-100 h-100 p-4" style="overflow-y: auto; overflow-x: hidden">
            <Inventory :isSelf="true"></Inventory>
          </div>
        </b-row>
        <b-row v-if="selectedView === false" class="w-100 my-2 backdrop">
          <div class="h-100 w-100 p-4" style="overflow-y: auto; overflow-x: hidden">
            <AccomplishmentCard
              v-for="accomplishment in activeAccomplishments"
              :key="accomplishment.id"
              :accomplishment="accomplishment"
              :showDescription="false"
            ></AccomplishmentCard>
          </div>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Vue } from "vue-property-decorator";
import TradeRequest from "@port-of-mars/client/components/game/phases/trade/TradeRequest.vue";
import Inventory from "@port-of-mars/client/components/game/Inventory.vue";
import AccomplishmentCard from "@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue";
import { TutorialAPI } from "@port-of-mars/client/api/tutorial/request";

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
