<template>
  <BContainer class="reset">
    <MasterComponent />
    <ProfileModal />
    <TradingModal />
    <CardModal />
    <BRow class="board reset">
      <BCol cols="2" class="left reset">
        <!-- left section goes here -->
        <ContainerLeft />
      </BCol>
      <BCol cols="8" class="reset">
        <BRow class="top reset">
          <ContainerTop />
        </BRow>
        <BRow class="bottom reset">
          <ContainerBottom />
        </BRow>
      </BCol>
      <BCol cols="2" class="right reset">
        <!-- right section goes here -->
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
import ProfileModal from '@/components/gamedashboard/ProfileModal.vue';
import CardModal from '@/components/gamedashboard/cards/CardModal.vue';
import TradingModal from '@/components/gamedashboard/trading/TradingModal.vue';

@Component({
  components: {
    BContainer,
    BRow,
    BCol,
    ContainerTop,
    ContainerBottom,
    ContainerLeft,
    ContainerRight,
    MasterComponent,
    ProfileModal,
    TradingModal,
    CardModal,
  },
})
export default class GameDashboard extends Vue {}
</script>

<style scoped>
.reset {
  margin: 0;
  padding: 0;
}

.board {
  height: 100vh;
  width: 100vw;
}

.left {
  position: relative;
  background-color: #1e2223;
}

.right {
  position: relative;
  background-color: #1e2223;
}

.top {
  height: 40vh;
  background-color: #1e2223;
}

.bottom {
  height: 60vh;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1e2223;
}
</style>
