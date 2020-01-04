<template>
  <div class="cm-transparent-wrapper" :style="{ display: setStyle }">
    <div class="cm-wrapper">
      <div class="row cm">
        <button class="cm-close-button" @click="closeModal">X</button>
        <component
          :is="cardData.card === 'accomplishment' ? 'ModalAccomplishment' : 'ModalEvent'"
          :cardData="cardData.payload"
        ></component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ModalAccomplishment from '@/components/gamedashboard/global/modals/views/ModalAccomplishment.vue';
import ModalEvent from '@/components/gamedashboard/global/modals/views/ModalEvent.vue';

@Component({
  components: {
    ModalAccomplishment,
    ModalEvent
  }
})
export default class ModalCard extends Vue {
  private setStyle: string = 'none';
  private cardData: object = {};

  mounted() {
    this.$root.$on('openCard', (data: any) => {
      this.cardData = data;
      this.setStyle = '';
    });
  }

  closeModal(): void {
    this.setStyle = 'none';
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/modals/ModalCard.scss';
</style>
