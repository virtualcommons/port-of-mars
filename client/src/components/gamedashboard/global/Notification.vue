<template>
  <div
    @click="hideNotif()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :class="viewAnim()"
    class="notification tour-notification"
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
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';

@Component({})
export default class Notification extends Vue {
  @Inject() readonly api!: GameRequestAPI;

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


      this.api.deleteNotification(this.index);

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
@import '@port-of-mars/client/stylesheets/gamedashboard/global/Notification.scss';
</style>
