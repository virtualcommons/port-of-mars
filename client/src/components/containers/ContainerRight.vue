<template>
    <div class="container-right">
      <TradingModal />
      <div class="placeholder-right">
        <!-- will eventually refactor -->
        <Member />
        <Member :setWidth='85'/>
        <Member />
        <Member />
        <Member />
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

export default class ContainerLeft extends Vue {
}
</script>

<style scoped>
.placeholder-right {
  display: flex;
  align-items: end;
  flex-direction: column;
  justify-content: space-between;
  height: 50%;
  padding: 1rem 0;
  /* background-color: purple; */
}

.container-right {
  height: 100%;
  width: 100%;
  padding: 1rem 1rem 1rem 0rem;
}
</style>
