<template>
  <b-container fluid class="h-100 m-0 p-0 tour-hud-left-toggle">
    <b-row class="h-100 w-auto m-0 p-0">
      <b-col cols="5" class="player">
        <Player />
        <HUDLeftButtons />
      </b-col>
      <b-col cols="7" class="views">
        <!-- OtherPlayers View -->
        <b-row
          v-show="currentView === view.OtherPlayers"
          class="h-100 p-0 m-0 other-players-view tour-players"
        >
          <b-container fluid class="hud-outer">
            <OtherPlayers
              v-for="player in otherPlayers"
              v-bind="player"
              :key="player.role"
            />
          </b-container>
        </b-row>

        <!-- Inventory View -->
        <b-row
          v-show="currentView === view.Inventory"
          class="h-100 py-3 m-0 outer tour-inventory-view"
        >
          <b-container fluid>
            <Inventory :isSelf="true" />
          </b-container>
        </b-row>

        <!-- Accomplishments View -->
        <b-row
          v-show="currentView === view.Accomplishments"
          class="tour-active-accomplishments"
          :style="'height: 60%'"
        >
          <b-container fluid class="p-3 mt-3 outer" fluid>
            <AccomplishmentCard
              v-for="accomplishment in accomplishmentCards"
              :key="accomplishment.id"
              :accomplishment="accomplishment"
              :showDescription="false"
              :showCost="false"
            />
          </b-container>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
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
.hud-outer {
  background-color: $light-shade-05;
  height: 85%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
