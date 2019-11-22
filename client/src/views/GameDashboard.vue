<template>
  <BContainer class="game-dashboard reset">
    <MasterComponent />
    <TradingModal />
    <ConfirmationModal />
    <CardModal />
    <EventModal />
    <BRow class="board reset">
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
import CardModal from '@/components/gamedashboard/cards/CardModal.vue';
import TradingModal from '@/components/gamedashboard/trading/TradingModal.vue';
import ConfirmationModal from '../components/gamedashboard/ConfirmationModal.vue';
import EventModal from '../components/gamedashboard/EventModal.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    MasterComponent,
    TradingModal,
    CardModal,
    ConfirmationModal,
    EventModal,
    ContainerLeft,
    ContainerTop,
    ContainerBottom,
    ContainerRight
  }
})
export default class GameDashboard extends Vue {}
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
