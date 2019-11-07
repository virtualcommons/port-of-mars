<template>
  <div class="notification" :class="viewAnim()">
    <p class="notification-message">{{ message }}</p>
    <!-- will be updated on props -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Notification extends Vue {
  // need to use transition wrapper!

  get message() {
    return this.$store.state.notifMessage;
  }

  get inView() {
    return this.$store.state.notifIsActive;
  }

  viewAnim() {
    // console.log(this.inView); // eslint-disable-line no-use-before-define
    if (this.inView === 'inactive') {
      return 'notification-hidden';
    }
    if (this.inView === 'visible') {
      return 'animated fadeInLeft';
    }
    if (this.inView === 'hide') {
      return 'animated fadeOut delay-1s';
    }
    return '';
  }

  mounted() {
    this.$root.$on('notification', (data: any) => {
      this.$store
        .dispatch('addToMarsLog', this.message)
        .then(() => {
          this.$store.dispatch('setNotificationStatus', 'visible');
        })
        .then(() => {
          // this.setStyle = 'hidden';
          // this.$store.dispatch('setNotificationStatus', 'hide');
        });
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

.notification-hidden {
  /* visibility: hidden; */
}

.notification-message {
  font-size: 0.75rem;
  margin: 0;
}
</style>
