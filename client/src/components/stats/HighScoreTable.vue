<template>
    <b-table
      dark
      sticky-header
      no-border-collapse
      fixed
      striped
      :style="`max-height: ${maxHeight}`"
      class="h-100 m-0 custom-table"
      :fields="showGameStats ? highScoresFields.concat(gameStatsFields) : highScoresFields"
      sort-by="rank"
      :sort-asc="true"
      sort-icon-left
    >
      <!-- headers -->
      <template #head(username)> Player </template>
      <template #head(points)>
        Points
        <small>
          <b-icon-question-circle id="hs-points-tooltip" class="ml-2" scale="1" />
        </small>
        <b-tooltip target="hs-points-tooltip" placement="top" variant="light">
          The total number of Victory Points a player has earned in games where the entire group
          survived.
        </b-tooltip>
      </template>
      <template #head(victoryPercentage)>
        Victory %
        <small>
          <b-icon-question-circle id="hs-victory-percentage-tooltip" class="ml-2" scale="1" />
        </small>
        <b-tooltip target="hs-victory-percentage-tooltip" placement="top" variant="light">
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
  import { SoloHighscoresData } from "@port-of-mars/shared/types";
  
  @Component({})
  export default class HighScoreTable extends Vue {
    @Prop({ default: 50 }) limit!: number;
    @Prop({ default: true }) showGameStats!: boolean;
    @Prop({ default: "none" }) maxHeight!: string;
  
    api!: StatsAPI;
  
    highscoresData: SoloHighscoresData = [];
    highScoresFields = [{ key: "rank", sortable: true }, { key: "points" }];
    gameStatsFields = [{ key: "victoryPercentage" }, { key: "totalGames" }];
  
    async created() {
      await this.fetchSoloHighscoresData();
    }
  
    async fetchSoloHighscoresData() {
      this.api = new StatsAPI(this.$store, this.$ajax);
      this.highscoresData = await this.api.getSoloHighscoresData(this.limit);
      // highlight the top score
      const highscores = this.highscoresData;
      if (highscores.length > 0) {
        const topScore = highscores[0].points;
        for (const player of highscores) {
          if (player.points < topScore) break;
          (player as any)._rowVariant = "success";
        }
      }
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
  