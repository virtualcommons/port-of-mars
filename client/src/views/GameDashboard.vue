<template>
  <div>
    <div v-show="gamePhase != phase.defeat" class="game-dashboard">
      <MasterComponent />
      <ModalConfirmation />
      <ModalServer />
      <ModalCard />
      <div class="board">
        <Notification
          v-for="(notification, index) in notifications"
          :index="index"
          :length="notifications.length"
          :key="index"
          :message="notification"
        />
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
    </div>
    <div v-show="gamePhase == phase.defeat" class="game-dashboard-defeat">
      <h1>You Died</h1>
      <button @click="handleRestart" class="restart-button">Restart the Game</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import MasterComponent from '@/components/MasterComponent.vue';
import ModalConfirmation from '../components/gamedashboard/global/modals/ModalConfirmation.vue';
import ModalServer from '../components/gamedashboard/global/modals/ModalServer.vue';
import ModalCard from '@/components/gamedashboard/global/modals/ModalCard.vue';
import Notification from '@/components/gamedashboard/global/Notification.vue';
import ContainerLeft from '@/components/gamedashboard/left/containers/ContainerLeft.vue';
import ContainerTop from '@/components/gamedashboard/top/containers/ContainerTop.vue';
import ContainerBottom from '@/components/gamedashboard/bottom/containers/ContainerBottom.vue';
import ContainerRight from '@/components/gamedashboard/right/containers/ContainerRight.vue';

import { Phase } from 'shared/types';
import { GameRequestAPI } from '@/api/game/request';

@Component({
  components: {
    MasterComponent,
    ModalConfirmation,
    ModalServer,
    ModalCard,
    Notification,
    ContainerLeft,
    ContainerTop,
    ContainerBottom,
    ContainerRight
  }
})
export default class GameDashboard extends Vue {
  @Inject() readonly $api!: GameRequestAPI;

  get notifications() {
    return this.$store.state.activeNotifications;
  }

  get phase() {
    return Phase;
  }

  get gamePhase() {
    return this.$store.state.phase;
  }

  handleRestart() {
    this.$api.resetGame();
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/views/GameDashboard.scss';
</style>
