<template>
  <div
    @click="hideNotif()"
    class="notification"
    :class="viewAnim()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <p class="notification-close" v-if="hover || inView === 'hide'">Close</p>
    <p class="notification-message" v-if="!hover && inView !== 'hide'">
      {{ message }} <br />
      Message: {{ index + 1 }}/{{ length }}
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class Notification extends Vue {
  // Note: may want to use transition wrapper
  private hover = false;

  @Prop({
    default: `you've been asleep for 20 years. this is the doctor's last way of contacting you from the outside. please wake up.`
  })
  message;
  @Prop({ default: 0 }) length;
  @Prop({ default: -1 }) index;

  inView = 'visible';

  mounted() {
    // console.log('MOUNTED');
    // setTimeout(() => {
    //   this.hideNotif();
    // }, 4000);
  }

  hideNotif() {
    this.inView = 'hide';

    setTimeout(() => {
      this.$store.state.activeNotifications.splice(this.index, 1);
    }, 1000);
  }

  viewAnim() {
    if (this.inView === 'visible') {
      return 'animated fadeInLeft';
    }
    if (this.inView === 'hide') {
      return 'animated fadeOutLeft fast';
      // return 'animated fadeOut faster';
    }
    return '';
  }
}
</script>

<style scoped>
.notification {
  height: 5rem;
  width: calc(calc(100 / 12) * 2%);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  position: absolute;
  z-index: 2;
  left: 1rem;
  top: 4rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: var(--space-orange);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.notification-inactive {
  visibility: hidden;
}
.notification-close,
.notification-message {
  margin: 0;
  font-size: var(--font-small);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
