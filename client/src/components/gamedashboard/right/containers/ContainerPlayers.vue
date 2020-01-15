<template>
  <div class="container-players">
    <p class="topbar">{{ topbarText }}</p>
    <Player v-for="player in playerInfo" v-bind="player" :key="player.role" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Player from '@/components/gamedashboard/right/Player.vue';
import { ROLES } from 'shared/types';

@Component({
  components: {
    Player
  }
})
export default class ContainerPlayers extends Vue {
  get topbarText(): string {
    const layout = this.$tstore.state.eventView;
    if (layout !== 'AUDIT') {
      return 'Player Scores';
    } else {
      return 'Player Scores (Audit)';
    }
  }

  get otherPlayers() {
    return this.$tstore.getters.otherPlayers;
  }

  get playerInfo() {
    const allPlayers = this.$tstore.state.players;
    return ROLES.map(player => ({
      role: player,
      ready: allPlayers[player].ready,
      victoryPoints: allPlayers[player].victoryPoints
    }));
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/right/containers/ContainerPlayers.scss';
</style>
