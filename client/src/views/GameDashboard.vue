<template>
  <BContainer class="reset">
    <MasterComponent/>
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
import ContainerTop from '@/components/gamedashboard/ContainerTop.vue';
import ContainerBottom from '@/components/gamedashboard/ContainerBottom.vue';
import ContainerLeft from '@/components/gamedashboard/ContainerLeft.vue';
import ContainerRight from '@/components/gamedashboard/ContainerRight.vue';
import MasterComponent from '@/components/MasterComponent.vue';

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
  /* overflow: hidden; */
}

.left {
  background-color: #1e2223;
}

.right {
  background-color: #1e2223;
}

.top {
  height: 40vh;
  background-color: #1e2223;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  height: 60vh;
  background-color: #1e2223;
}
</style>
