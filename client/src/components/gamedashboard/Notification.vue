<template>
  <div
    class="notification"
    :class="viewAnim()"
    @click="hideNotif()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <p class="notification-close" v-if="hover || inView === 'hide-close'">Close</p>
    <p class="notification-message" v-if="!hover && inView !== 'hide-close'">{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Notification extends Vue {
  // Note: may want to use transition wrapper
  private hover = false;

  get message() {
    return this.$store.state.notifMessage;
  }

  get inView() {
    return this.$store.state.notifIsActive;
  }

  hideNotif() {
    this.$store.dispatch('setNotificationStatus', 'hide-close');
  }

  viewAnim() {
    if (this.inView === 'inactive') {
      return 'notification-inactive';
    }
    if (this.inView === 'visible') {
      return 'animated fadeInLeft';
    }
    if (this.inView === 'hide') {
      return 'animated fadeOutLeft';
      // return 'animated fadeOut faster';
    }
    if (this.inView === 'hide-close') {
      return 'animated fadeOutLeft notification-hide';
      // return 'animated fadeOut faster';
    }
    return '';
  }

  mounted() {
    // Note: may want to refactor this...
    this.$root.$on('notification', (data: any) => {
      this.$store.dispatch('addToMarsLog', data).then(() => {
        if (this.inView === 'inactive' || this.inView === 'hide' || this.inView === 'hide-close') {
          this.$store.dispatch('setNotificationStatus', 'visible').then(() => {
            setTimeout(() => {
              this.$store.dispatch('setNotificationStatus', 'hide');
            }, 4000);
          });
        }
      });
    });
  }
}
</script>

<style scoped>
.notification {
  height: 5rem;
  width: calc(calc(100 / 12) * 2%);
  padding: 0.5rem;
  border-radius: 1rem;
  position: absolute;
  z-index: 2;
  left: 1rem;
  top: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--space-orange);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.notification:hover,
.notification-hide {
  border: var(--border-white);
  color: var(--space-white);
  background-color: var(--space-gray);
}

.notification-inactive {
  visibility: hidden;
}

.notification-close,
.notification-message {
  font-size: var(--font-small);
  margin: 0;
}
</style>
