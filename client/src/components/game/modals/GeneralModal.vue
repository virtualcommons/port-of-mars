<template>
  <div class="general-modal container">
    <div class="title-wrapper row">
      <div class="title col-12">
        <p>{{ modalData.title }}</p>
      </div>
    </div>
    <div class="content-wrapper row">
      <div class="content col-12">
        <p>{{ modalData.content }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { GeneralModalData } from '@port-of-mars/client/types/modals';

@Component({})
export default class GeneralModal extends Vue {
  @Prop({}) private modalData!: GeneralModalData;
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/modals/GeneralModal.scss';
</style>
