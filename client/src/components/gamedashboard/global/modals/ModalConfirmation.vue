<template>
  <div class="modal-confirmation">
    <div class="content">
      <p class="header">Are you sure?</p>
      <p class="details">{{ modalData.text }}</p>
    </div>
    <button
      class="confirm"
      type="button"
      name="Confirm Button"
      @click="handleConfirmation"
    >
      Yes
    </button>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, InjectReactive, Inject} from 'vue-property-decorator';
import { GameRequestAPI } from '@/api/game/request';

@Component({})
export default class ModalConfirmation extends Vue {
  @Prop({}) private modalData!: object;

  @Inject() readonly api!: GameRequestAPI;

  private handleConfirmation() {
    switch (this.modalData.type) {
      case 'discardAccomplishment':
        this.api.discardAccomplishment(this.modalData.actionData);
      default:
        this.$root.$emit('closeModal');
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/modals/ModalConfirmation.scss';
</style>
