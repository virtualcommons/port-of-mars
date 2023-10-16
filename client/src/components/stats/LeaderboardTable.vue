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
        <b-icon-question-circle id="l-points-tooltip" class="ml-2" scale="1" />
      </small>
      <b-tooltip target="l-points-tooltip" placement="top" variant="light">
        The total number of Victory Points a player has earned in games where the entire group
        survived.
      </b-tooltip>
    </template>
    <template #head(victoryPercentage)>
      Victory %
      <small>
        <b-icon-question-circle id="l-victory-percentage-tooltip" class="ml-2" scale="1" />
      </small>
      <b-tooltip target="l-victory-percentage-tooltip" placement="top" variant="light">
        Percentage of games that ended in victory that this player has participated in (not
        necessarily as the highest scoring player).
      </b-tooltip>
    </template>
    <template #head(totalGames)> Games Played </template>
    <!-- cells -->
    <template #cell(rank)="data">
      {{ "#" + data.item.rank }}
    </template>
    <template #cell(victoryPercentage)="data"> {{ getVictoryPercentage(data.item) }}% </template>
    <template #cell(totalGames)="data">
      {{ getTotalGamesPlayed(data.item) }}
    </template>
  </b-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { StatsAPI } from "@port-of-mars/client/api/stats/request";
import { LeaderboardData, LeaderboardItem } from "@port-of-mars/shared/types";

@Component({})
export default class Leaderboard extends Vue {
  @Prop({ default: false }) showWithBots!: boolean;
  @Prop({ default: 50 }) limit!: number;
  @Prop({ default: true }) showGameStats!: boolean;
  @Prop({ default: "none" }) maxHeight!: string;

  api!: StatsAPI;

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
    this.api = new StatsAPI(this.$store, this.$ajax);
    this.leaderboardData = await this.api.getLeaderboardData(this.limit);
    this.highlightLeaderAndSelf();
  }

  highlightLeaderAndSelf() {
    // dont highlight leader in the 'with bots' table
    this.highlightLeader(this.leaderboardData.withoutBots);
    this.highlightSelf(this.leaderboardData.withoutBots);
    this.highlightSelf(this.leaderboardData.withBots);
  }

  highlightLeader(leaderboard: LeaderboardItem[]) {
    const topScore = leaderboard[0].points;
    leaderboard
      .filter(player => player.points === topScore)
      .forEach(player => ((player as any)._rowVariant = "success"));
  }

  highlightSelf(withOrWithoutBots: LeaderboardItem[]) {
    const { username } = this.$store.state.user;
    const self = withOrWithoutBots.find(player => player.username === username);
    if (self) (self as any)._rowVariant = "primary";
  }

  getWinsLosses(item: any) {
    return {
      wins: parseInt(item.wins),
      losses: parseInt(item.losses),
    };
  }

  getVictoryPercentage(item: any) {
    const { wins, losses } = this.getWinsLosses(item);
    const percentage = (wins / (wins + losses)) * 100;
    return percentage === 100 ? 100 : percentage.toFixed(0);
  }

  getTotalGamesPlayed(item: any) {
    const { wins, losses } = this.getWinsLosses(item);
    return wins + losses;
  }
}
</script>
