<template>
  <div
    class="notification"
    :class="viewAnim()"
    @click="hideNotif()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <p class="notification-close" v-if="hover || inView === 'hide'">Close</p>
    <p class="notification-message" v-if="!hover">{{ message }}</p>
    <!-- will be updated on props -->
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Notification extends Vue {
  // need to use transition wrapper!
  private dismiss = 'dismiss...';

  private hover = false;

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
      this.$store.dispatch('addToMarsLog', data).then(() => {
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
  background-color: var(--space-orange);
  border-radius: 1rem;
  margin: 1rem 0;
  padding: 0.5rem;
  cursor: pointer;
  /* background-color: blue; */
}

.notification:hover {
  border: var(--border-white);
  background-color: var(--space-gray);
  color: var(--space-white);
}

.notification-hidden {
  visibility: hidden;
}

.notification-hidden {
  /* visibility: hidden; */
}

.notification-message {
  /* height: 100%; */
  /* width: 100%; */
  font-size: var(--font-small);
  margin: 0;
  /* background-color: green; */
  /* text-align: center; */
}

.notification-close {
  /* height: 100%; */
  /* width: 100%; */
  font-size: var(--font-small);
  margin: 0;
  /* background-color: blue; */
}
</style>
