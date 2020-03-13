<template>
  <div class="container-board">
    <UserHeader />
    <div class="tour-notification" />
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
import UserHeader from '@/components/global/UserHeader.vue';
import ContainerLeft from '@/components/gamedashboard/left/containers/ContainerLeft.vue';
import ContainerTop from '@/components/gamedashboard/top/containers/ContainerTop.vue';
import ContainerBottom from '@/components/gamedashboard/bottom/containers/ContainerBottom.vue';
import ContainerRight from '@/components/gamedashboard/right/containers/ContainerRight.vue';


@Component({
  components: {
    UserHeader,
    ContainerLeft,
    ContainerTop,
    ContainerBottom,
    ContainerRight
  }
})
export default class ContainerBoard extends Vue {
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/global/containers/ContainerBoard.scss';
</style>
