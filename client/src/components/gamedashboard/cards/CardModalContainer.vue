<template>
  <div class="cm-transparent-wrapper" :style="{ display: setStyle }">
    <div class="cm-wrapper">
      <div class="row cm">
        <button class="cm-close-button" @click="closeModal">X</button>
        <component
          :is="cardData.card === 'accomplishment' ? 'CardModalAccomplishment' : 'CardModalEvent'"
          :cardData="cardData.payload"
        ></component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import CardModalAccomplishment from '@/components/gamedashboard/cards/CardModalAccomplishment.vue';
import CardModalEvent from '@/components/gamedashboard/cards/CardModalEvent.vue';

@Component({
  components: {
    CardModalAccomplishment,
    CardModalEvent
  }
})
export default class CardModalContainer extends Vue {
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
@import '@/stylesheets/gamedashboard/cards/CardModalContainer.scss';
</style>
