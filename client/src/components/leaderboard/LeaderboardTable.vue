<template>
  <b-table
    dark
    sticky-header
    no-border-collapse
    fixed
    striped
    :style="`max-height: ${maxHeight}`"
    class="h-100 m-0 custom-table"
    :fields="showGameStats ? leaderboardFields.concat(gameStatsFields) : leaderboardFields"
    :items="showWithBots ? leaderboardData.withBots : leaderboardData.withoutBots"
    sort-by="rank"
    :sort-asc="true"
    sort-icon-left
  >
    <!-- headers -->
    <template #head(username)> Player </template>
    <template #head(points)>
      Points
      <small>
        <b-icon-question-circle id="points-tooltip" class="ml-2" scale="1" />
      </small>
      <b-tooltip target="points-tooltip" placement="top" variant="light">
        The total number of Victory Points a player has earned in games where the entire group survived.
      </b-tooltip>
    </template>
    <template #head(victoryPercentage)> Victory % 
      <small>
        <b-icon-question-circle id="victory-percentage-tooltip" class="ml-2" scale="1" />
      </small>
      <b-tooltip target="victory-percentage-tooltip" placement="top" variant="light">
      Percentage of games that ended in victory that this player has participated in (not necessarily as the highest scoring player).
      </b-tooltip>
    </template>
    <template #head(totalGames)> Games Played </template>
    <!-- cells -->
    <template #cell(rank)="data">
      {{ "#" + data.item.rank }}
    </template>
    <template #cell(victoryPercentage)="data">
      {{ getVictoryPercentage(data.item) }}%
    </template>
    <template #cell(totalGames)="data">
      {{ getTotalGamesPlayed(data.item) }}
    </template>
  </b-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { LeaderboardAPI } from "@port-of-mars/client/api/leaderboard/request";
import { LeaderboardData } from "@port-of-mars/shared/types";

@Component({})
export default class Leaderboard extends Vue {
  @Prop({ default: false }) showWithBots!: boolean;
  @Prop({ default: 50 }) limit!: number;
  @Prop({ default: true }) showGameStats!: boolean;
  @Prop({ default: "none" }) maxHeight!: string;

  api!: LeaderboardAPI;

  leaderboardData: LeaderboardData = {
    withBots: [],
    withoutBots: [],
  };
  leaderboardFields = [{ key: "rank", sortable: true }, { key: "username" }, { key: "points" }];
  gameStatsFields = [{ key: "victoryPercentage" }, { key: "totalGames" }];

  async created() {
    await this.fetchLeaderboardData();
  }

  async fetchLeaderboardData() {
    this.api = new LeaderboardAPI(this.$store, this.$ajax);
    this.leaderboardData = await this.api.getLeaderboardData(this.limit);
    // highlight top player(s)
    const noBots = this.leaderboardData.withoutBots;
    if (noBots && noBots.length > 0) {
      const topPlayer = noBots[0];
      const maxPoints = topPlayer.points;
      for (const player of noBots) {
        if (player.points < maxPoints) break;
        // FIXME: look into better color palette
        (player as any)._rowVariant = "success";
      }
    }
  }

  extractWinsLosses(item: any) {
    return {
      wins: parseInt(item.wins),
      losses: parseInt(item.losses),
    };
  }

  getVictoryPercentage(item: any) {
    const { wins, losses } = this.extractWinsLosses(item);
    const percentage = (wins / (wins + losses)) * 100;
    return percentage === 100 ? 100 : percentage.toFixed(0);
  }

  getTotalGamesPlayed(item: any) {
    const { wins, losses } = this.extractWinsLosses(item);
    return wins + losses;
  }
}
</script>
