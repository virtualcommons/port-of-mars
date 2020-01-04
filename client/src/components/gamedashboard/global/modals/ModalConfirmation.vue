<template>
  <div class="transparent-wrapper" :style="{ display: setStyle }">
    <div class="com">
      <div class="com-content">
        <p class="com-content-header">Are you sure?</p>
        <p class="com-content-question">{{ text }}</p>
      </div>
      <div class="com-buttons">
        <button class="cancel-button" type="button" name="Cancel Button" @click="handleCancel">
          Cancel
        </button>
        <button class="yes-button" type="button" name="Yes Button" @click="handleYes">Yes</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator';
import { GameRequestAPI } from '@/api/game/request';
import { Phase } from 'shared/types';

@Component({})
export default class ModalConfirmation extends Vue {
  setStyle: string = 'none';
  action: any = '';
  type = '';
  text = '';

  @Inject()
  readonly $api!: GameRequestAPI;

  mounted() {
    this.$root.$on('openConfirmation', data => {
      this.setStyle = '';
      this.type = data.type;
      this.text = data.text;
      this.action = data.actionData;
    });
  }

  handleCancel(): void {
    this.setStyle = 'none';
  }

  handleYes() {
    switch (this.type) {
      case 'discardAccomplishment':
        this.$api.discardAccomplishment(this.action);
    }
    this.setStyle = 'none';
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/modals/ModalConfirmation.scss';
</style>
