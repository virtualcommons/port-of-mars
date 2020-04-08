<template>
  <div class="c-hud container">
    <div class="wrapper row">
      <!-- REFACTOR :: PlayerContainer -->
      <div class="players col-6 tour-profile">
        <div class="wrapper container">
          <div class="row">
            <div class="player col- tour-profile-self">
              <Player />
            </div>
            <div class="others col-7 tour-players">
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
      <div class="gamestatus col-6">
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
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Player from './static/panels/Player.vue';
import OtherPlayers from './static/panels/OtherPlayers.vue';
import GameInformation from './static/panels/GameInformation.vue';
import PhaseInstructions from './static/panels/PhaseInstructions.vue';
import { ROLES, Role } from '@port-of-mars/shared/types';
import { PlayerClientSet } from '@port-of-mars/client/store/state';

@Component({
  components: {
    Player,
    OtherPlayers,
    GameInformation,
    PhaseInstructions,
  },
})
export default class HUD extends Vue {
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
@import '@port-of-mars/client/stylesheets/game/HUD.scss';
</style>
