<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 backdrop">
    <div class="h-100 w-100 p-3 overflow-auto">
      <b-row class="h-100 w-100 m-0">
        <b-col cols="12" class="mh-100 p-2">
          <GameStats v-for="item in playerStatItems" :key="item.time" :playerStatItem="item">
          </GameStats>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { StatsAPI } from "@port-of-mars/client/api/stats/request";
import { PlayerStatItem } from "@port-of-mars/shared/types";
import GameStats from "@port-of-mars/client/components/stats/GameStats.vue";

@Component({
  components: {
    GameStats,
  },
})
export default class PlayerHistory extends Vue {
  api!: StatsAPI;

  playerStatItems: Array<PlayerStatItem> = [];

  async created() {
    await this.fetchPlayerStats();
  }

  async fetchPlayerStats() {
    this.api = new StatsAPI(this.$store, this.$ajax);
    this.playerStatItems = await this.api.getPlayerHistory();
  }
}
</script>

<style lang="scss" scoped></style>
