<template>
  <div class="c-traderequestmodal container">
    <button
      @click="handleExit"
      type="button"
      name="Close Button"
      class="modal-close"
    >
      <font-awesome-icon
        :icon="['fas', 'times']"
        size="lg"
        class="close-icon"
      />
    </button>
    <div class="wrapper row">
      <div class="traderequest col-8">
        <div class="topbar">
          <p class="title">Request a Trade</p>
        </div>
        <TradeRequest class="actions" />
      </div>
      <div class="activeaccomplishments col-4">
        <div class="topbar">
          <p class="title">Purchasable Accomplishments</p>
        </div>

        <div class="outer-wrapper">
          <div class="wrapper">
            <!-- <BarAccomplishment
              v-for="accomplishment in purchasableAccomplishments"
              :accomplishment="accomplishment"
              :purchase="false"
              :discard="false"
              :key="accomplishment.label + Math.random()"
            /> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AccomplishmentData } from '@port-of-mars/shared/types';
import TradeRequest from '@port-of-mars/client/components/game/phases/trade/TradeRequest.vue';
// import ContainerAccomplishmentsGeneral from '@port-of-mars/client/components/game/accomplishments/ContainerAccomplishmentsGeneral.vue';
// import BarAccomplishment from '@port-of-mars/client/components/newGameDashboard/global/cards/BarAccomplishment.vue';
import { canPurchaseAccomplishment } from '@port-of-mars/shared/validation';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTimes);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {
    TradeRequest,
    // ContainerAccomplishmentsGeneral,
  },
})
export default class TradeRequestModal extends Vue {
  get activeAccomplishments() {
    return this.$tstore.getters.player.accomplishments.purchasable;
  }

  get purchasableAccomplishments() {
    return this.$store.getters.player.accomplishments.purchasable
      .slice()
      .sort((a: AccomplishmentData, b: AccomplishmentData) => {
        return (
          Number(
            canPurchaseAccomplishment(b, this.$store.getters.player.inventory)
          ) -
          Number(
            canPurchaseAccomplishment(a, this.$store.getters.player.inventory)
          )
        );
      });
  }

  private handleExit() {
    this.$tstore.commit('SET_TRADE_REQUEST_MODAL_VISIBILITY', false);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/modals/TradeRequestModal.scss';
</style>
