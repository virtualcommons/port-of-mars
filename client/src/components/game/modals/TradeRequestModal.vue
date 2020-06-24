<template>
  <div class="c-trade-request-modal">
    <div class="wrapper row">
      <div class="trade-request col-8">
        <div class="topbar">
          <p class="title">Request a Trade</p>
        </div>
        <div class="outer-wrapper">
          <div class="wrapper">
            <TradeRequest />
          </div>
        </div>
      </div>
      <div class="side-view col-4">
        <div class="buttons">
          <button
            @click="switchView('Inventory')"
            :class="selectedView === 'Inventory' ? 'selected' : ''"
          >
            Inventory
          </button>
          <button
            @click="switchView('Active Accomplishments')"
            :class="selectedView === 'Active Accomplishments' ? 'selected' : ''"
          >
            Accomplishments
          </button>
        </div>
        <div class="topbar">
          <p class="title">{{ selectedView }}</p>
        </div>
        <div v-if="selectedView === 'Inventory'" class="inventory-wrapper">
          <div class="inventory">
            <Inventory :isSelf="true" />
          </div>
        </div>
        <div
          v-if="selectedView === 'Active Accomplishments'"
          class="accomplishment-cards-wrapper"
        >
          <div class="accomplishment-cards">
            <AccomplishmentCard
              v-for="accomplishment in activeAccomplishments"
              :key="accomplishment.id"
              :accomplishment="accomplishment"
              :showDescription="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue, Prop } from 'vue-property-decorator';
import { TradeRequestModalData } from '@port-of-mars/shared/game/client/modals';
import TradeRequest from '@port-of-mars/client/components/game/phases/trade/TradeRequest.vue';
import Inventory from '@port-of-mars/client/components/game/Inventory.vue';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import { TutorialAPI } from '../../../api/tutorial/request';

@Component({
  components: {
    TradeRequest,
    Inventory,
    AccomplishmentCard,
  },
})
export default class TradeRequestModal extends Vue {
  @Prop({}) private modalData!: TradeRequestModalData;
  @Inject() readonly api!: TutorialAPI;
  private selectedView: string = 'Inventory';

  private switchView(view: string) {
    this.selectedView = view;
  }

  get activeAccomplishments() {
    return this.$tstore.getters.player.accomplishments.purchasable;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/modals/TradeRequestModal.scss';
</style>
