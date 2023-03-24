<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 overflow-auto backdrop">
    <div class="h-100 w-100 p-3">
      <b-row class="h-100 w-100 m-0">
        <b-col cols="12" class="mh-100 p-2">
          <PlayerStat v-for="item in playerStatItems" :key="item.time" :playerStatItem="item">
          </PlayerStat>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { LeaderboardAPI } from "@port-of-mars/client/api/leaderboard/request";
import { PlayerStatItem } from "@port-of-mars/shared/types";
import PlayerStat from "@port-of-mars/client/components/leaderboard/PlayerStatItem.vue";

@Component({
  components: {
    PlayerStat,
  },
})
export default class PlayerStats extends Vue {
  api!: LeaderboardAPI;

  playerStatItems: Array<PlayerStatItem> = [];

  async created() {
    await this.fetchLeaderboardData();
  }

  async fetchLeaderboardData() {
    this.api = new LeaderboardAPI(this.$store, this.$ajax);
    this.playerStatItems = await this.api.getPlayerStats();
  }
}
</script>

<style lang="scss" scoped></style>
