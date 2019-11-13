<template>
  <BContainer class="reset">
    <MasterComponent />
    <ProfileModal />
    <TradingModal />
    <CardModal />
    <BRow class="board reset">

      <BCol cols="2" class="left reset">
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
    MasterComponent,
    ProfileModal,
    TradingModal,
    CardModal,
    ContainerLeft,
    ContainerTop,
    ContainerBottom,
    ContainerRight,
  },
})
export default class GameDashboard extends Vue {}
</script>

<style scoped>
.reset {
  padding: 0;
  margin: 0;
}

.board {
  height: 100vh;
  width: 100vw;
  padding: 1rem;
  background-color: var(--space-gray);
}

.left, .right {
  height: 100%;
  position: relative;
  display: flex;
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
