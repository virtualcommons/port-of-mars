<template>
  <div class="container-right">
    <TradingModal />
    <!-- will eventually refactor -->
    <div class="placeholder-right">
      <p class="scores-title">Scores</p>
      <Member :playerRole="'Researcher'" />
      <Member :playerRole="'Politician'" :setWidth="100" />
      <Member :playerRole="'Pioneer'" />
      <Member :playerRole="'Curator'" />
      <Member :playerRole="'Entrepreneur'" />
    </div>
    <Chat />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Member from '@/components/Leaderboard/Member.vue';
import Chat from '@/components/Chat.vue';
import TradingModal from '@/components/containers/Trading/TradingModal.vue';

@Component({
  components: {
    Member,
    Chat,
    TradingModal,
  },
})
export default class ContainerLeft extends Vue {}
</script>

<style scoped>
.container-right {
  height: 100%;
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
