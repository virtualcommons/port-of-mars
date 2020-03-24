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
              <OtherPlayers />
              <OtherPlayers />
              <OtherPlayers />
              <OtherPlayers />
            </div>
          </div>
        </div>
      </div>

      <!-- REFACTOR :: GameStatusContainer -->
      <div class="gamestatus col-4">
        <div class="wrapper container">
          <div class="row">
            <div class="information">
              <!-- <GameInformation /> -->
            </div>
            <div class="instructions">
              <!-- <PhaseInstructions /> -->
            </div>
          </div>
          <GameStatus />
        </div>
      </div>

      <!-- REFACTOR :: MarsLogContainer -->
      <div class="marslog col-4">
        <div class="wrapper"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import StatusBar from '@port-of-mars/client/components/gamedashboard/global/StatusBar.vue';
import Player from '@port-of-mars/client/components/gamedashboard/top/Player.vue';
import OtherPlayers from '@port-of-mars/client/components/gamedashboard/top/OtherPlayers.vue';

@Component({
  components: {
    StatusBar,
    Player,
    OtherPlayers
  }
})
export default class NewGameBoardTop extends Vue {}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/top/containers/NewGameBoardTop.scss';
</style>
