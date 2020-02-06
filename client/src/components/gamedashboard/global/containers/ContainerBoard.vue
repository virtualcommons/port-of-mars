<template>
  <div class="container-board">
    <Notification
      v-for="(notification, index) in notifications"
      :index="index"
      :length="notifications.length"
      :key="index"
      :message="notification"
    />
    <div class="tour-notification"/>
    <div class="left">
      <ContainerLeft />
    </div>

    <div class="middle">
      <div class="top">
        <ContainerTop />
      </div>
      <div class="bottom">
        <ContainerBottom />
      </div>
    </div>

    <div class="right">
      <ContainerRight />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Notification from '@/components/gamedashboard/global/Notification.vue';
import ContainerLeft from '@/components/gamedashboard/left/containers/ContainerLeft.vue';
import ContainerTop from '@/components/gamedashboard/top/containers/ContainerTop.vue';
import ContainerBottom from '@/components/gamedashboard/bottom/containers/ContainerBottom.vue';
import ContainerRight from '@/components/gamedashboard/right/containers/ContainerRight.vue';

@Component({
  components: {
    Notification,
    ContainerLeft,
    ContainerTop,
    ContainerBottom,
    ContainerRight
  }
})
export default class ContainerBoard extends Vue {
  get notifications() {
    console.log('ran!');
    return this.$store.state.activeNotifications;
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/global/containers/ContainerBoard.scss';
</style>
