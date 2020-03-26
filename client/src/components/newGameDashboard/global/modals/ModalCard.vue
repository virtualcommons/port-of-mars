<template>
  <div class="modal-card">
    <component :is="setView()" :cardData="modalData.payload"></component>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ModalAccomplishment from '@port-of-mars/client/components/gamedashboard/global/modals/views/ModalAccomplishment.vue';
import ModalEvent from '@port-of-mars/client/components/gamedashboard/global/modals/views/ModalEvent.vue';

@Component({
  components: {
    ModalAccomplishment,
    ModalEvent
  }
})
export default class ModalCard extends Vue {
  @Prop({}) private modalData!: any;

  private setView(): string {
    switch (this.modalData.card) {
      case 'accomplishment':
        return 'ModalAccomplishment';
        break;
      case 'event':
        return 'ModalEvent';
        break;
      default:
        return 'ModalAccomplishment';
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/global/modals/ModalCard.scss';
</style>
