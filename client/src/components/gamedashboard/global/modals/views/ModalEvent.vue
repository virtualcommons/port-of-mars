<template>
  <div class="modal-event">
    <p class="title">{{ cardData.name }}</p>
    <p class="info">{{ cardData.flavorText }}</p>
    <p class="effects-title"><span>Effects</span></p>
    <p class="effects">{{ cardData.effect }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {AccomplishmentData} from "@port-of-mars/shared/types";

@Component({})
export default class ModalEvent extends Vue {
  @Prop({
    default: () => ({
      name: undefined,
      flavorText: undefined,
      effect: undefined
    })
  })
  private cardData!: AccomplishmentData;
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/modals/views/ModalEvent.scss';
</style>
