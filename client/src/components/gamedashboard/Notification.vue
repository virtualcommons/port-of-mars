<template>
  <div 
    @click="hideNotif()"
    class="notification"
    :class="viewAnim()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <p class="notification-close" v-if="hover">Close</p>
    <p class="notification-message" v-if="!hover">{{ message }} <br/> Message: {{index+1}}/{{ length }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class Notification extends Vue {
  // Note: may want to use transition wrapper
  private hover = false;

  @Prop({default:`you've been asleep for 20 years. this is the doctor's last way of contacting you from the outside. please wake up.`}) message;
  @Prop({default: 0}) length;
  @Prop({default: -1}) index;

  inView = 'visible';

  hideNotif() {
    this.inView = 'hide-close';
    
    setTimeout(()=> {
      this.$store.state.activeNotifications.splice(this.index,1);
    },1000);
  }

  viewAnim() {
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
}
</script>

<style scoped>
.notification {
  height: 5rem;
  width: 14rem;
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
.notification:hover, .notification-hide {
  border: var(--border-white);
  color: var(--space-white);
  background-color: var(--space-gray);
}
.notification-inactive {
  visibility: hidden;
}
.notification-close, .notification-message {
  font-size: var(--font-med);
  margin: 0;
}
</style>
