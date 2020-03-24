<template>
  <div class="c-gameboardtop container">
    <!-- REFACTOR :: SystemHealthContainer -->
    <!-- <StatusBar :setWidth="80" /> -->
    <div class="row">
      <!-- REFACTOR :: PlayerContainer -->
      <div class="players col-4">
        <div class="wrapper container">
          <div class="row">
            <div class="player col-5">
              <Player />
            </div>
            <div class="others col-7">
              <OtherPlayers
                v-for="player in otherPlayers"
                v-bind="player"
                :key="player.role"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- REFACTOR :: GameStatusContainer -->
      <div class="gamestatus col-4">
        <div class="wrapper container">
          <div class="row">
            <div class="information col-5">
              <GameInformation />
            </div>
            <div class="instructions col-7">
              <PhaseInstructions />
            </div>
          </div>
          <GameStatus />
        </div>
      </div>

      <!-- REFACTOR :: MarsLogContainer -->
      <div class="marslog col-4">
        <div class="wrapper">
          <NewMarsLog />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import StatusBar from '@port-of-mars/client/components/gamedashboard/global/StatusBar.vue';
import Player from '@port-of-mars/client/components/gamedashboard/top/Player.vue';
import OtherPlayers from '@port-of-mars/client/components/gamedashboard/top/OtherPlayers.vue';
import GameInformation from '@port-of-mars/client/components/gamedashboard/top/GameInformation.vue';
import PhaseInstructions from '@port-of-mars/client/components/gamedashboard/top/PhaseInstructions.vue';
import NewMarsLog from '@port-of-mars/client/components/gamedashboard/top/NewMarsLog.vue';
import { ROLES, Role } from '@port-of-mars/shared/types';

@Component({
  components: {
    StatusBar,
    Player,
    OtherPlayers,
    GameInformation,
    PhaseInstructions,
    NewMarsLog
  }
})
export default class NewGameBoardTop extends Vue {
  get otherPlayers(): any {
    const otherPlayers = this.$tstore.getters.otherPlayers;
    console.log('otherPlayers: ', otherPlayers);
    return Object.keys(otherPlayers).reduce((prev, player) => {
      const role = player;
      const ready = otherPlayers[player].ready;
      const victoryPoints: number = otherPlayers[player].victoryPoints;
      prev.push({ role, ready, victoryPoints });
      return prev;
    }, [] as Array<{ role: Role; ready: boolean; victoryPoints: number }>);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/top/containers/NewGameBoardTop.scss';
</style>
