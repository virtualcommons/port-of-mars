<template>
  <b-row class="h-100 w-100 m-0 p-0 overflow-hidden">
    <b-col cols="5" class="h-100 w-100 m-0 p-0 text-center">
      <b-row class="w-100">
        <Player></Player>
      </b-row>
      <b-row align-v="end" class="w-100 py-2">
        <HUDLeftButtons></HUDLeftButtons>
      </b-row>
    </b-col>
    <b-col
      cols="7"
      v-show="currentView === view.OtherPlayers"
      class="h-100 w-100 p-0 m-0 tour-players"
      style="background-color: rgba(241, 224, 197, 0.05);
             overflow-y: auto; overflow-x: hidden;"
    >
      <OtherPlayers
        v-for="player in otherPlayers"
        v-bind="player"
        :key="player.role"
      ></OtherPlayers>
    </b-col>
    <b-col
      cols="7"
      v-show="currentView === view.Inventory"
      class="h-100 w-100 p-0 m-0"
      style="background-color: rgba(241, 224, 197, 0.05); overflow-y: auto; overflow-x: hidden;"
    >
      <div class="w-100 position-absolute" style="overflow-y: auto; overflow-x: hidden;">
        <Inventory :isSelf="true" />
      </div>
    </b-col>
    <b-col
      cols="7"
      v-show="currentView === view.Accomplishments"
      class="h-100 w-100 p-0 m-0 tour-active-accomplishments"
      style="background-color: rgba(241, 224, 197, 0.05);"
    >
      <div class="h-100 w-100 position-absolute" style="overflow-y: auto; overflow-x: hidden;">
        <AccomplishmentCard
          v-for="accomplishment in accomplishmentCards"
          :key="accomplishment.id"
          :accomplishment="accomplishment"
          :showDescription="false"
          :showCost="false"
        ></AccomplishmentCard>
      </div>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import Player from "./static/panels/Player.vue";
import HUDLeftButtons from "@port-of-mars/client/components/game/HUDLeftButtons.vue";
import OtherPlayers from "./static/panels/OtherPlayers.vue";
import Inventory from "@port-of-mars/client/components/game/Inventory.vue";
import AccomplishmentCard from "@port-of-mars/client/components/game/accomplishments/AccomplishmentCard.vue";

import { HUDLeftView } from "@port-of-mars/shared/game/client/panes";
import { PlayerClientSet } from "@port-of-mars/shared/game/client/state";
import { Role } from "@port-of-mars/shared/types";

@Component({
  components: {
    Player,
    HUDLeftButtons,
    OtherPlayers,
    Inventory,
    AccomplishmentCard
  }
})
export default class HUDLeft extends Vue {
  get currentView() {
    return this.$tstore.state.userInterface.hudLeftView;
  }

  get view() {
    return HUDLeftView;
  }

  get otherPlayers(): any {
    const otherPlayers: Partial<PlayerClientSet> = this.$tstore.getters.otherPlayers;
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
.scroll-container {
  background-color: $light-shade-05;
  height: 45%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
