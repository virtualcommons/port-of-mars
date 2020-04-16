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
      <div class="cards col-4">
        <div class="topbar">
          <p class="title">Active Accomplishments</p>
        </div>
        <div class="outer-wrapper">
          <div class="wrapper">
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
import { TradeRequestModalData } from '@port-of-mars/client/types/modals';
import TradeRequest from '@port-of-mars/client/components/game/phases/trade/TradeRequest.vue';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';
import { TutorialAPI } from '../../../api/tutorial/request';

@Component({
  components: {
    TradeRequest,
    AccomplishmentCard,
  },
})
export default class TradeRequestModal extends Vue {
  @Prop({}) private modalData!: TradeRequestModalData;
  @Inject() readonly api!: TutorialAPI;

  get activeAccomplishments() {
    return this.$tstore.getters.player.accomplishments.purchasable;
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/modals/TradeRequestModal.scss';
</style>
