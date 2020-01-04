<template>
  <div class="server-message-modal-wrapper" :style="{ display: setStyle }">
    <div class="server-message-modal">
      <button class="smm-close-button" @click="closeModal">X</button>
      <div class="smm-container">
        <div class="smm-title">
          <p><span>!!! </span>Message from Server<span> !!!</span></p>
        </div>
        <div class="smm-message">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut vestibulum.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class ServerMessageModal extends Vue {
  setStyle: string = 'none';

  mounted() {
    this.$root.$on('openServerMessage', data => {
      this.setStyle = '';
    });
  }

  closeModal(): void {
    this.setStyle = 'none';
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/ServerMessageModal.scss';
</style>
