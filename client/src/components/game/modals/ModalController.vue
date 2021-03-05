<template>
  <b-row v-if="modalsVisible"
         class="h-100 w-100 m-0 p-0 position-absolute justify-content-center align-items-center"
         style="backdrop-filter: blur(2px); z-index: 4; background-color: var(--dark-shade-75)"
  >
    <b-col class="d-flex flex-column justify-content-center align-items-center" cols="4">
      <!-- modal type: event, accomplishment -->
      <component :is="modalType" :modalData="modalData"></component>

      <!-- close modal button -->
      <button
        @click="handleClose"
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

    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, Inject } from 'vue-property-decorator';
import GeneralModal from '@port-of-mars/client/components/game/modals/GeneralModal.vue';
import CardModal from '@port-of-mars/client/components/game/modals/CardModal.vue';
import PlayerModal from '@port-of-mars/client/components/game/modals/PlayerModal.vue';
import TradeRequestModal from '@port-of-mars/client/components/game/modals/TradeRequestModal.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { Phase } from '@port-of-mars/shared/types';

library.add(faTimes);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {
    GeneralModal,
    CardModal,
    PlayerModal,
    TradeRequestModal,
  },
})
export default class ModalController extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  get modalsVisible() {
    return this.$tstore.state.userInterface.modalView.visible;
  }

  get modalType() {
    const type = this.$tstore.state.userInterface.modalView.type;
    if (type) {
      return type;
    } else {
      return 'GeneralModal';
    }
  }

  get modalData() {
    const data = this.$tstore.state.userInterface.modalView.data;
    if (data) {
      return data;
    } else {
      return {
        activator: 'Default',
        title: '',
        content: '',
      };
    }
  }

  private handleClose(): void {
    if (this.modalsVisible) {
      this.api.setModalHidden();
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/modals/ModalController.scss';
</style>
