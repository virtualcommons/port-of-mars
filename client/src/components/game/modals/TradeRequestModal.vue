<template>
  <div class="trade-request-modal">
    <div class="trade-request-container">
      <div class="header">
        <h5>Request A Trade</h5>
      </div>
      <TradeRequest class="actions" />
    </div>

    <div class="active-accomplishments-container">
      <div class="active-accomplishments-section">
        <div class="header">
          <h5>Active Accomplishments</h5>
        </div>

        <div class="active-accomplishments">
          <ContainerAccomplishmentsGeneral
            :accomplishmentSet="activeAccomplishments"
            :isVisible="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue, Prop } from 'vue-property-decorator';
import { TradeRequestModalData } from '@port-of-mars/client/types/modals';
import TradeRequest from '@port-of-mars/client/components/game/phases/trade/TradeRequest.vue';
import ContainerAccomplishmentsGeneral from '@port-of-mars/client/components/game/accomplishments/ContainerAccomplishmentsGeneral.vue';
import { TutorialAPI } from '@port-of-mars/client/api/tutorial/request';

@Component({
  components: {
    TradeRequest,
    ContainerAccomplishmentsGeneral,
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
