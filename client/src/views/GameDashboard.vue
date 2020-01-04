<template>
  <div>
    <div v-show="gamePhase != phase.defeat" class="game-dashboard">
      <MasterComponent />
      <ConfirmationModal />
      <ServerMessageModal />
      <CardModalContainer />
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
import ConfirmationModal from '../components/gamedashboard/ConfirmationModal.vue';
import ServerMessageModal from '../components/gamedashboard/ServerMessageModal.vue';
import CardModalContainer from '@/components/gamedashboard/cards/CardModalContainer.vue';
import Notification from '@/components/gamedashboard/Notification.vue';
import ContainerLeft from '@/components/gamedashboard/containers/ContainerLeft.vue';
import ContainerTop from '@/components/gamedashboard/containers/ContainerTop.vue';
import ContainerBottom from '@/components/gamedashboard/containers/ContainerBottom.vue';
import ContainerRight from '@/components/gamedashboard/containers/ContainerRight.vue';

import { Phase } from 'shared/types';
import { GameRequestAPI } from '@/api/game/request';

@Component({
  components: {
    MasterComponent,
    ConfirmationModal,
    ServerMessageModal,
    CardModalContainer,
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
