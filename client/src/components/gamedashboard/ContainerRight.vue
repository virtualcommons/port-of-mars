<template>
  <div class="container-right">
    <TradingModal />
    <!-- will eventually refactor -->
    <div class="placeholder-right" id="v-step-1">
      <p class="scores-title">Scores</p>
      <Member :playerRole="'Researcher'" :playerScore="14" :notificationCount="1" />
      <Member
        :playerRole="'Politician'"
        :playerScore="12"
        :notificationCount="0"
        :width="100"
        id="v-step-17" />
      <Member :playerRole="'Pioneer'" :playerScore="11" :notificationCount="0" />
      <Member :playerRole="'Curator'" :playerScore="5" :notificationCount="2" />
      <Member :playerRole="'Entrepreneur'" :playerScore="3" :notificationCount="0" />
    </div>
    <Chat id="v-step-2" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Member from '@/components/gamedashboard/Member.vue';
import Chat from '@/components/gamedashboard/Chat.vue';
import TradingModal from '@/components/gamedashboard/trading/TradingModal.vue';

@Component({
  components: {
    Member,
    Chat,
    TradingModal,
  },
})
export default class ContainerRight extends Vue {}
</script>

<style scoped>
.container-right {
  height: 100vh;
  width: 100%;
  padding: 1rem 1rem 1rem 0rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.placeholder-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  height: 50%;
  width: 100%;
  padding-bottom: 1rem;
  /* background-color: purple; */
}

.scores-title {
  margin-bottom: 1rem;
  color: #f5f5f5;
  font-size: 1.5rem;
}
</style>
