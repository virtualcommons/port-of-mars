<template>
  <div class="transparent-wrapper" :style="{ display: setStyle }">
    <div class="com">
      <div class="com-content">
        <p class="com-content-header">Are you sure?</p>
        <p class="com-content-question">{{text}}</p>
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
import { RequestAPI } from '../../api/request';
import { Phase } from "shared/types";

@Component({})
export default class ConfirmationModal extends Vue {
  setStyle: string = 'none';
  action: any = '';
  type = '';
  text = '';

  @Inject()
  readonly $api!:RequestAPI;

  mounted() {
    this.$root.$on('openConfirmation', (data) => {
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
      case 'discardAccomplishment': this.$api.discardAccomplishment(this.action);
    }
    this.setStyle = 'none';
  }
}
</script>

<style scoped>
.transparent-wrapper {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(30, 34, 35, 0.8);
}

.com {
  position: relative;
  height: 26.375rem;
  width: 37.5rem;
  padding: 1rem 2rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border: var(--border-white);
  border-radius: 1.25rem;
  color: var(--space-white);
  background-color: var(--space-gray);
  overflow: hidden;
}

.com-content-header,
.com-content-question {
  text-align: center;
}

.com-content-question {
  margin: 0;
}

.com-content-header {
  font-size: var(--font-large);
}

.com-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cancel-button,
.yes-button {
  margin: 0.5rem;
}

.cancel-button {
  height: 3rem;
  width: 12.5rem;
  border: 0.125rem solid var(--space-orange);
  border-radius: 0.5rem;
  color: var(--space-white);
  background: none;
}

.cancel-button:active,
.cancel-button:focus {
  outline: none !important;
}

.yes-button {
  height: 3rem;
  width: 12.5rem;
  border-radius: 0.5rem;
  border: 0.125rem solid var(--space-orange);
  background-color: var(--space-orange);
}

.yes-button:focus,
.yes-button:active {
  outline: none !important;
}
</style>
