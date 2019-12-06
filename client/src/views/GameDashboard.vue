<template>
  <BContainer class="game-dashboard reset">
    <MasterComponent />
    <TradingModal />
    <ConfirmationModal />
    <CardModal />
    <BRow class="board reset">
      <Notification v-for="(notification, index) in notifications" :index='index' :length='notifications.length' :key='index' :message='notification'/>
      <BCol cols="2" class="left reset">
        <ContainerLeft />
      </BCol>

      <BCol cols="8" class="middle reset">
        <BRow class="top reset">
          <ContainerTop />
        </BRow>
        <BRow class="bottom reset">
          <ContainerBottom />
        </BRow>
      </BCol>

      <BCol cols="2" class="right reset">
        <ContainerRight />
      </BCol>
    </BRow>
  </BContainer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { BContainer, BRow, BCol } from 'bootstrap-vue';
import ContainerTop from '@/components/gamedashboard/containers/ContainerTop.vue';
import ContainerBottom from '@/components/gamedashboard/containers/ContainerBottom.vue';
import ContainerLeft from '@/components/gamedashboard/containers/ContainerLeft.vue';
import ContainerRight from '@/components/gamedashboard/containers/ContainerRight.vue';
import MasterComponent from '@/components/MasterComponent.vue';
import TradingModal from '@/components/gamedashboard/trading/TradingModal.vue';
import ConfirmationModal from '../components/gamedashboard/ConfirmationModal.vue';
import CardModal from '@/components/gamedashboard/cards/CardModal.vue';
import Notification from '@/components/gamedashboard/Notification.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    MasterComponent,
    TradingModal,
    ConfirmationModal,
    CardModal,
    Notification,
    ContainerLeft,
    ContainerTop,
    ContainerBottom,
    ContainerRight
  }
})
export default class GameDashboard extends Vue {
  get notifications(){
    console.log(this.$store.state.activeNotifications);
    return this.$store.state.activeNotifications;
  }
}
</script>

<style scoped>
.reset {
  padding: 0;
  margin: 0;
}

.game-dashboard {
  height: 100vh !important;
  width: 100vw !important;
  max-width: none !important;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--space-gray);
}

.board {
  height: 100%;
  width: 100%;
  /* SET MAX SIZE OF SCREEN */
  max-height: var(--max-screen-height);
  max-width: var(--max-screen-width);
  /* SET MIN SIZE OF SCREEN */
  min-height: var(--min-screen-height);
  min-width: var(--min-screen-width);
  padding: 1rem;
  position: relative;
  background-color: var(--space-gray);
}

.left,
.right {
  height: 100%;
  position: relative;
  display: flex;
}

.middle {
  height: 100%;
}

.top {
  height: 40%;
}

.bottom {
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
