<template>
  <div class="modal-confirmation tour-confirmation">
    <div class="content">
      <p class="header">Are you sure?</p>
      <div class="details">
        <p>{{ modalData.text }}</p>
        <div v-if="modalData.type == 'discardAccomplishment'">
          <p>This card is worth {{ modalData.victoryPoints }} points</p>
          <p>Cost</p>
          <div class="cost">
            <p
              v-for="investment in modalData.cost"
              :key="investment + Math.random()"
            >
              <img
                :src="require(`@port-of-mars/client/assets/icons/${investment}.svg`)"
                alt="Investment"
              />
            </p>
          </div>
        </div>
      </div>
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
import {
  Component,
  Vue,
  Prop,
  InjectReactive,
  Inject
} from 'vue-property-decorator';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';

@Component({})
export default class ModalConfirmation extends Vue {
  @Prop({}) private modalData!: any;

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
@import '@port-of-mars/client/stylesheets/generalComponents/modals/ModalConfirmation.scss';
</style>
