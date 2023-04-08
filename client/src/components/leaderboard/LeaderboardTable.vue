<template>
  <b-table
    dark
    sticky-header
    no-border-collapse
    fixed
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
        The total number of victory points a player has earned in games that survived.
      </b-tooltip>
    </template>
    <template #head(winPercent)> Victory % </template>
    <template #head(numGames)> Games Played </template>
    <!-- cells -->
    <template #cell(rank)="data">
      {{ "#" + data.item.rank }}
    </template>
    <template #cell(winPercent)="data">
      {{ getVictoryPercent(data.item) + "%" }}
    </template>
    <template #cell(numGames)="data">
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
  gameStatsFields = [{ key: "winPercent" }, { key: "numGames" }];

  async created() {
    await this.fetchLeaderboardData();
  }

  async fetchLeaderboardData() {
    this.api = new LeaderboardAPI(this.$store, this.$ajax);
    this.leaderboardData = await this.api.getLeaderboardData(this.limit);
  }

  parseNumGames(item: any) {
    return {
      wins: parseInt(item.wins),
      losses: parseInt(item.losses),
    };
  }

  getVictoryPercent(item: any) {
    const { wins, losses } = this.parseNumGames(item);
    const percentage = (wins / (wins + losses)) * 100;
    return percentage === 100 ? 100 : percentage.toFixed(1);
  }

  getTotalGamesPlayed(item: any) {
    const { wins, losses } = this.parseNumGames(item);
    return wins + losses;
  }
}
</script>

<style lang="scss" scoped></style>
