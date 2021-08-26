<template>
  <b-modal
    id="gameModal"
    centered
    :title="modalData.title"
    :size="modalType === 'CardModal' ? 'lg' : 'xl'"
    hide-footer
    header-bg-variant="secondary"
    body-bg-variant="info"
    @hidden="hide"
    no-stacking
    :hide-header="modalType === 'CardModal'"
  >
    <template #default>
      <component :is="modalType" :modalData="modalData"></component>
    </template>
  </b-modal>
</template>

<script lang="ts">
import {Component, Vue, Prop, Inject} from 'vue-property-decorator';
import CardModal from '@port-of-mars/client/components/game/modals/CardModal.vue';
import PlayerModal from '@port-of-mars/client/components/game/modals/PlayerModal.vue';
import TradeRequestModal from '@port-of-mars/client/components/game/modals/TradeRequestModal.vue';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {GameRequestAPI} from '@port-of-mars/client/api/game/request';


library.add(faTimes);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {
    CardModal,
    PlayerModal,
    TradeRequestModal,
  },
})
export default class ModalController extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  get modalType() {
    const type = this.$tstore.state.userInterface.modalView.type;
    if (type) {
      return type;
    } else {
      return null;
    }
  }

  get modalData() {
    const data = this.$tstore.state.userInterface.modalView.data;
    if (data) {
      return data;
    }
  }

  hide(): void {
    this.api.setModalHidden();
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/modals/ModalController.scss';
</style>
