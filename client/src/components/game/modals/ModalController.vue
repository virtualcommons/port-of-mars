<template>
  <div class="c-modal-controller" v-if="modalsVisible">
    <div class="wrapper">
      <component :is="modalType" :modalData="modalData"></component>
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
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import GeneralModal from '@port-of-mars/client/components/game/modals/GeneralModal.vue';
import CardModal from '@port-of-mars/client/components/game/modals/CardModal.vue';
import PlayerModal from '@port-of-mars/client/components/game/modals/PlayerModal.vue';
import TradeRequestModal from '@port-of-mars/client/components/game/modals/TradeRequestModal.vue';

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
      this.$tstore.commit('SET_MODAL_HIDDEN', null);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/modals/ModalController.scss';
</style>
