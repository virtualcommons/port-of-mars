<template>
  <div class="c-gameboardtop container">
    <!-- REFACTOR :: SystemHealthContainer -->
    <div class="top row">
      <p class="title">System Health</p>
      <StatusBar class="statusbar" :setWidth="`${systemHealthStatus}`" />
      <p class="status">{{ systemHealthStatus }}<span>%</span></p>
    </div>
    <div class="bottom row">
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
        </div>
      </div>

      <!-- REFACTOR :: MarsLogContainer -->
      <div class="marslog col-4">
        <div class="wrapper">
          <!-- <NewMarsLog /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import StatusBar from '@port-of-mars/client/components/newGameDashboard/global/StatusBar.vue';
import Player from '@port-of-mars/client/components/newGameDashboard/top/Player.vue';
import OtherPlayers from '@port-of-mars/client/components/newGameDashboard/top/OtherPlayers.vue';
import GameInformation from '@port-of-mars/client/components/newGameDashboard/top/GameInformation.vue';
import PhaseInstructions from '@port-of-mars/client/components/newGameDashboard/top/PhaseInstructions.vue';
// import NewMarsLog from '@port-of-mars/client/components/newGameDashboard/top/NewMarsLog.vue';
import { ROLES, Role } from '@port-of-mars/shared/types';
import { PlayerClientSet } from '@port-of-mars/client/store/state';

@Component({
  components: {
    StatusBar,
    Player,
    OtherPlayers,
    GameInformation,
    PhaseInstructions
    // NewMarsLog
  }
})
export default class NewGameBoardTop extends Vue {
  get systemHealthStatus() {
    return this.$tstore.state.upkeep;
  }

  get otherPlayers(): any {
    const otherPlayers: Partial<PlayerClientSet> = this.$tstore.getters
      .otherPlayers;
    return Object.keys(otherPlayers).reduce((prev, player) => {
      const role: Role = player as Role;
      const ready: boolean = otherPlayers[role]!.ready;
      const victoryPoints: number = otherPlayers[role]!.victoryPoints;
      prev.push({ role, ready, victoryPoints });
      return prev;
    }, [] as Array<{ role: Role; ready: boolean; victoryPoints: number }>);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/top/containers/NewGameBoardTop.scss';
</style>
