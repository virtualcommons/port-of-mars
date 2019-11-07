<template>
  <div class="notification" :class="viewAnim()" @click="hideNotif()">
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

  hideNotif() {
    this.$store.dispatch('setNotificationStatus', 'hide');
  }

  viewAnim() {
    // console.log(this.inView); // eslint-disable-line no-use-before-define
    if (this.inView === 'reset') {
      return '';
    }
    if (this.inView === 'inactive') {
      return 'notification-hidden';
    }
    if (this.inView === 'visible') {
      return 'animated fadeInLeft';
    }
    if (this.inView === 'attention') {
      return 'animated bounce';
    }
    if (this.inView === 'hide') {
      return 'animated fadeOutLeft';
    }
    return '';
  }

  mounted() {
    // Note: may want to think about this implementation...
    this.$root.$on('notification', (data: any) => {
      this.$store.dispatch('addToMarsLog', this.message).then(() => {
        if (this.inView === 'inactive' || this.inView === 'hide') {
          this.$store.dispatch('setNotificationStatus', 'visible');
        } else {
          this.$store.dispatch('setNotificationStatus', 'reset').then(() => {
            setTimeout(() => {
              this.$store.dispatch('setNotificationStatus', 'attention');
            }, 500);
          });
        }
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
  cursor: pointer;
}

.notification-hidden {
  visibility: hidden;
}

.notification-message {
  font-size: 0.75rem;
  margin: 0;
}
</style>
