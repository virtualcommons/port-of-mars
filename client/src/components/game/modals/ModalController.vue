<template>
  <b-modal
    id="gameModal"
    class="tour-trade-player tour-request-resources tour-offer-resources"
    centered
    :title="modalData.title"
    :size="modalType === 'CardModal' ? 'lg' : 'xl'"
    hide-footer
    header-bg-variant="primary"
    header-border-variant="primary"
    body-bg-variant="dark"
    @hidden="hide"
    :hide-header="modalType === 'CardModal'"
  >
    <template #default>
      <component :is="modalType" :modalData="modalData"></component>
    </template>
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import CardModal from "@port-of-mars/client/components/game/modals/CardModal.vue";
import PlayerModal from "@port-of-mars/client/components/game/modals/PlayerModal.vue";
import TradeRequestModal from "@port-of-mars/client/components/game/modals/TradeRequestModal.vue";
import Manual from "@port-of-mars/client/components/game/modals/Manual.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";

library.add(faTimes);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({
  components: {
    CardModal,
    Manual,
    PlayerModal,
    TradeRequestModal
  }
})
export default class ModalController extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  get modalType() {
    const type = this.$tstore.state.userInterface.modal.type;
    if (type) {
      return type;
    } else {
      return null;
    }
  }

  get modalData() {
    const data = this.$tstore.state.userInterface.modal.data;
    if (data) {
      return data;
    } else {
      return {
        title: null,
        content: null
      };
    }
  }

  hide(): void {
    this.api.setModalHidden();
    this.$root.$emit("bv::hide::modal", "gameModal");
  }
}
</script>
