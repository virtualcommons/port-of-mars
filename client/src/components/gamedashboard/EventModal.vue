<template>
  <div class="white-wrapper" :style="{ display: setStyle }">
    <div class="em">
      <p class="em-header">Event Modal</p>
      <p class="em-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pellentesque iaculis tortor
        non placerat. Class aptent taciti sociosqu ad litora.
      </p>
      <button class="em-close-button" type="button" name="Close Button" @click="handleClose">
        Close
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class EventModal extends Vue {
  setStyle: string = 'none';

  mounted() {
    this.$root.$on('openEvent', (data: string) => {
      this.setStyle = '';
    });
  }

  handleClose(): void {
    this.setStyle = 'none';
  }
}
</script>

<style scoped>
.white-wrapper {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--space-white);
}

.em {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--space-gray);
}

.em-header {
  font-size: var(--font-large);
}

.em-content {
  font-size: var(--font-med);
}

.em-close-button {
  height: 3rem;
  width: 12.5rem;
  border: 0.125rem solid var(--space-gray);
  border-radius: 0.5rem;
  color: var(--space-white);
  background: var(--space-gray);
}

.em-close-button:active,
.em-close-button:focus {
  outline: none !important;
}
</style>
