<template>
  <div class="container-members">
    <!-- <Member
      v-for="(player, role) in otherPlayers"
      :key="role"
      :playerRole="role"
      :playerScore="player.victoryPoints"
      :memberNotificationTradeCount="1"
      :memberNotificationFinished="true"
    /> -->
    <p>scoreboard under construction</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Member from '@/components/gamedashboard/Member.vue';

@Component({
  components: {
    Member
  }
})
export default class ContainerMembers extends Vue {
  get otherPlayers() {
    return this.$tstore.getters.otherPlayers;
  }
}
</script>

<style scoped>
.container-members {
  max-height: 50%;
  width: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--space-white-opaque-1);
}

.container-members p {
  margin-bottom: 0;
  font-size: var(--font-small);
  color: var(--space-white);
}
</style>
