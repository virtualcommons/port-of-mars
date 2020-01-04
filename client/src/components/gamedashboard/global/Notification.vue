<template>
  <div
    @click="hideNotif()"
    class="notification"
    :class="viewAnim()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <p class="notification-close" v-if="hover || inView === 'hide'">Dismiss Notification</p>
    <p class="notification-message" v-if="!hover && inView !== 'hide'">
      {{ message }}
    </p>
    <p class="notification-message">N<sup>o</sup> : {{ index + 1 }} of {{ length }}</p>
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
    }
    return '';
  }
}
</script>

<style lang="scss" scoped>
@import '~animate.css/source/fading_entrances/fadeInLeft.css';
@import '~animate.css/source/fading_exits/fadeOutLeft.css';
@import '@/stylesheets/gamedashboard/global/Notification.scss';
</style>
