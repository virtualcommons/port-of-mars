<template>
  <div class="notification" :style="{ display: setStyle }">
    <p class="notification-message">{{ message }}</p>
    <!-- will be updated on props -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Notification extends Vue {
  // message: string = this.$store.state.notifMessage;
  setStyle: string = 'none';

  get message() {
    return this.$store.state.notifMessage;
  }

  mounted() {
    this.$root.$on('notification', (data: any) => {
      this.setStyle = '';
      this.$store.dispatch('addToMarsLog', this.message);
    });
  }
}
</script>

<style scoped>
.notification {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 5rem;
  background-color: #c67b5c;
  border-radius: 1rem;
  margin: 1rem 0;
  padding: 0.75rem;
}

.notification-message {
  font-size: 0.75rem;
  margin: 0;
}
</style>
