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
    <p class="container-members-topbar">Player Scores</p>
    <Member v-for="player in playerInfo" v-bind="player" />
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
  mounted() {
    console.log(this.playerInfo);
  }

  get otherPlayers() {
    return this.$tstore.getters.otherPlayers;
  }

  get playerInfo() {
    const allPlayers = this.$tstore.state.players;
    return Object.keys(allPlayers).map(player => ({
      role: player,
      victoryPoints: allPlayers[player].victoryPoints
    }));
  }
}
</script>

<style scoped>
.container-members {
  height: auto;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  border: 0.125rem solid var(--space-orange-opaque-2);
}

.container-members-topbar {
  width: 100%;
  padding: 0.5rem;
  border-bottom: 0.125rem solid var(--space-white-opaque-2);
  margin-bottom: 0.5rem;
  font-size: var(--font-med);
  text-align: right;
  /* color: var(--space-orange); */
  color: var(--space-white-opaque-2);
  /* background-color: var(--space-orange); */
  background-color: transparent;
}
</style>
