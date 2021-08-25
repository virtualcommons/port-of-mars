<template>
  <b-container v-if="isVisible"
               fluid
               class="h-100 w-100 m-0 p-0 position-absolute justify-content-center align-items-center"
               style="backdrop-filter: blur(2px); z-index: 4; background-color: var(--dark-shade-75)"
  >
      <b-modal
        id="gameModal"
        class="h-100"
        centered
        :title="modalData.title"
        size="xl"
        hide-footer
        :hide-header="modalType !== 'CardModal'"
        header-bg-variant="secondary"
        body-bg-variant="info"
        @hidden="handleClose"
      >
        <component :is="modalType" :modalData="modalData"></component>
      </b-modal>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';
import GeneralModal from '@port-of-mars/client/components/game/modals/GeneralModal.vue';
import CardModal from '@port-of-mars/client/components/game/modals/CardModal.vue';
import PlayerModal from '@port-of-mars/client/components/game/modals/PlayerModal.vue';
import TradeRequestModal from '@port-of-mars/client/components/game/modals/TradeRequestModal.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';


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

  get isVisible() {
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
        title: 'Default modal title',
        content: 'Default modal content',
      };
    }
  }

  handleClose(): void {
    if (this.isVisible) {
      this.api.setModalHidden();
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/modals/ModalController.scss';
</style>
