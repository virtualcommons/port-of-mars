<template>
  <div class="container-right">
    <!-- <TradingModal /> -->
    <!-- will eventually refactor -->
    <p class="scores-title">Player Scores</p>
    <div class="container-right-member-container" id="v-step-1">
        <Member
          :playerRole="'Researcher'"
          :playerScore="14"
          :notificationCount="1"
          :style="{ 'background-color': 'rgba(67, 124, 174, 0.2)' }"
        />
        <Member
          :playerRole="'Pioneer'"
          :playerScore="11"
          :notificationCount="0"
          :style="{ 'background-color': 'rgba(111, 36, 134, 0.2)' }"
        />
        <Member
          :playerRole="'Curator'"
          :playerScore="5"
          :notificationCount="2"
          :style="{ 'background-color': 'rgba(103, 65, 29, 0.2)' }"
        />
        <Member
          :playerRole="'Entrepreneur'"
          :playerScore="3"
          :notificationCount="0"
          :style="{ 'background-color': 'rgba(199, 168, 40, 0.2)' }"
        />
    </div>
    <Chat id="v-step-2" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Member from '@/components/gamedashboard/Member.vue';
import Chat from '@/components/gamedashboard/Chat.vue';
// import TradingModal from '@/components/gamedashboard/trading/TradingModal.vue';

@Component({
  components: {
    Member,
    Chat,
    // TradingModal,
  },
})
export default class ContainerRight extends Vue {}
</script>

<style scoped>
@media (max-width: 1680px) {
  .container-right p {
    margin-bottom: 2rem;
  }
}

.container-right {
  height: 100vh;
  width: 100%;
  padding: 1rem 1rem 1rem 0rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.container-right p {
  width: 100%;
  text-align: right;
}

.container-right-member-container {
  flex-grow: 1;
  /* height: 100%; */
  width: 100%;
  /* padding-bottom: 2rem; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
}

.scores-title {
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: #f5f5f5;
}
</style>
