<template>
  <div class="modal-container" v-if="visible">
    <div class="wrapper">
      <component :is="modalView" :modalData="modalData"></component>
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
import ModalCard from '@/components/gamedashboard/global/modals/ModalCard.vue';
import ModalConfirmation from '@/components/gamedashboard/global/modals/ModalConfirmation.vue';
import ModalServer from '@/components/gamedashboard/global/modals/ModalServer.vue';
import ModalProblem from '@/components/gamedashboard/global/modals/ModalProblem.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTimes);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {
    ModalCard,
    ModalConfirmation,
    ModalServer,
    ModalProblem
  }
})
export default class ModalContainer extends Vue {
  private visible: boolean = false;
  private modalView: string = 'ModalCard';
  private modalData: object = {};

  mounted() {
    this.$root.$on('openModalCard', (data: any) => {
      this.modalView = 'ModalCard';
      this.modalData = data;
      this.visible = true;
    });

    this.$root.$on('openmodalconfirmation', (data: any) => {
      this.modalView = 'ModalConfirmation';
      this.modalData = data;
      this.visible = true;
    });

    this.$root.$on('openModalServer', (data: any) => {
      this.modalView = 'ModalServer';
      this.modalData = data;
      this.visible = true;
    });

    this.$root.$on('openModalProblem', (data: any) => {
      this.modalView = 'ModalProblem';
      this.modalData = data;
      this.visible = true;
    });

    this.$root.$on('closeModal', (data: any) => {
      this.visible = false;
    });
  }

  private handleClose(): void {
    this.visible = false;
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/modals/ModalContainer.scss';
</style>
