<template>
  <div :style="{ display: setStyle }">
    <button @click="handleClick()">X</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class TradingModal extends Vue {
  setStyle: string = 'none';

  mounted() {
    this.$root.$on('openTrading', (data: any) => {
      // Important: will need to set data type
      this.setStyle = '';
    });
  }

  handleClick() {
    this.setStyle = 'none';
  }
}
</script>

<style scoped>
div {
  width: 1000px;
  height: 600px;
  background-color: aqua;
  position: absolute;
  top: 50%;
  left: -200%;
  transform: translate(-50%, -50%);
}
</style>
