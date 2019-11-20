<template>
  <div class="white-wrapper" :style="{ display: setStyle }">
    <div class="em">
      <p class="em-header">THIS IS AN EVENT!</p>
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
  background-color: var(--space-gray);
}

.em {
  height: 80%;
  width: 100%;
  max-height: var(--max-screen-height);
  max-width: var(--max-screen-width);
  min-height: var(--min-screen-height);
  min-width: var(--min-screen-width);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: var(--space-white);
  /* background-color: pink; */
}

.em-header {
  font-size: var(--font-large);
}

.em-content {
  width: 50%;
  text-align: center;
  padding: 1rem;
  font-size: var(--font-med);
  color: var(--space-white);
  background-color: var(--space-gray);
}

.em-close-button {
  height: 3rem;
  width: 12.5rem;
  border: var(--border-white);
  border-radius: 0.5rem;
  color: var(--space-white);
  background: none;
  transition: all .2s ease-in-out;
}

.em-close-button:hover {
  color: var(--space-gray);
  background: var(--space-white);
}

.em-close-button:active,
.em-close-button:focus {
  outline: none !important;
}
</style>
