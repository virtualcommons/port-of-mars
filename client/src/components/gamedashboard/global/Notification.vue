<template>
  <div
    @click="hideNotif()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :class="viewAnim()"
    class="notification"
  >
    <p class="button-close" v-if="hover || inView === 'hide'">
      Dismiss Notification
    </p>
    <p class="message" v-if="!hover && inView !== 'hide'">
      {{ message }}
    </p>
    <p class="message">N<sup>o</sup> : {{ index + 1 }} of {{ length }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({})
export default class Notification extends Vue {
  @Prop({
    default: `you've been asleep for 20 years. this is the doctor's last way of contacting you from the outside. please wake up.`
  })
  message!: string;
  @Prop({ default: 0 }) length!: number;
  @Prop({ default: -1 }) index!: number;

  private hover: boolean = false;
  private inView: string = 'visible';

  private hideNotif(): void {
    this.inView = 'hide';

    setTimeout(() => {
      this.$store.state.activeNotifications.splice(this.index, 1);
    }, 1000);
  }

  private viewAnim(): string {
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
