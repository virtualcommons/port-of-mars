<template>
  <div class="c-hud-left container">
    <div class="wrapper row">
      <div class="player col-5">
        <Player />
        <HUDLeftButtons />
      </div>
      <div class="views col-7">
        <!-- OtherPlayers View -->
        <div
          v-show="currentView === view.OtherPlayers"
          class="other-players-view row tour-players"
        >
          <OtherPlayers
            v-for="player in otherPlayers"
            v-bind="player"
            :key="player.role"
          />
        </div>

        <!-- Inventory View -->
        <div
          v-show="currentView === view.Inventory"
          class="inventory-view row tour-inventory-view"
        >
          <Inventory :isSelf="true" />
        </div>

        <!-- Accomplishments View -->
        <div
          v-show="currentView === view.Accomplishments"
          class="accomplishments-view tour-active-accomplishments"
        >
          <div class="wrapper">
            <AccomplishmentCard
              v-for="accomplishment in accomplishmentCards"
              :key="accomplishment.id"
              :accomplishment="accomplishment"
              :showDescription="false"
              :showCost="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

import Player from './static/panels/Player.vue';
import HUDLeftButtons from '@port-of-mars/client/components/game/HUDLeftButtons.vue';
import OtherPlayers from './static/panels/OtherPlayers.vue';
import Inventory from '@port-of-mars/client/components/game/Inventory.vue';
import AccomplishmentCard from '@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue';

import { HUDLeftView } from '@port-of-mars/shared/game/client/panes';
import { PlayerClientSet } from '@port-of-mars/shared/game/client/state';
import { Role } from '@port-of-mars/shared/types';

@Component({
  components: {
    Player,
    HUDLeftButtons,
    OtherPlayers,
    Inventory,
    AccomplishmentCard,
  },
})
export default class HUDLeft extends Vue {
  get currentView() {
    return this.$tstore.state.userInterface.hudLeftView;
  }

  get view() {
    return HUDLeftView;
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

  get accomplishmentCards(): any {
    const player = this.$tstore.getters.player;
    return player ? player.accomplishments.purchasable : [];
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/HUDLeft.scss';
</style>
