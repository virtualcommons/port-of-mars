<template>
  <div class="container-players">
    <p class="topbar">Player Scores</p>
    <Player v-for="player in playerInfo" v-bind="player" :key="player.role"/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Player from '@/components/gamedashboard/right/Player.vue';

@Component({
  components: {
    Player
  }
})
export default class ContainerPlayers extends Vue {
  get otherPlayers() {
    return this.$tstore.getters.otherPlayers;
  }

  get playerInfo() {
    const allPlayers = this.$tstore.state.players;
    return Object.keys(allPlayers).map(player => ({
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
