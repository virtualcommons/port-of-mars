<!-- Initializes table -->
<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 overflow-auto backdrop">
    <div class="h-100 w-100 p-3">
      <b-row class="h-100 w-100 m-0">
        <b-col cols="12" class="mh-100 p-2">
          <h4 class="header-nowrap">Leaderboard</h4>
          <div id="filter-options" class="p-2">
            <b-form-checkbox v-model="showWithBots" class="mx-3">
              Include games with bots
            </b-form-checkbox>
          </div>
          <div class="h-100-header w-100 content-container">
            <b-table
              dark
              sticky-header
              style="max-height: none"
              class="h-100 m-0 custom-table"
              :fields="exFields"
              :items="exItems"
              sort-by="rank"
              :sort-asc="true"
            >
            </b-table>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<!-- Initializes table components & orders rank in ascending order-->
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { LeaderboardAPI } from "@port-of-mars/client/api/leaderboard/request";
import { LeaderboardData } from "@port-of-mars/shared/types";

@Component({})
export default class Leaderboard extends Vue {
  api!: LeaderboardAPI;

  showWithBot: boolean = true;

  leaderboardData: LeaderboardData = {
    withBots: [],
    withoutBots: [],
  };
  leaderboardFields: any = []; // FIXME: replace with fields

  // example data
  showWithBots = [alert("checked")];
  exFields = ["rank", "user_name", "position", "points"];
  exItems = [
    { rank: 2, user_name: "hotdogs", position: "Entrepreneur", points: 32 },
    { rank: 10, user_name: "popcorn", position: "Politician", points: 50 },
    { rank: 39, user_name: "cupcakes", position: "Scientist", points: 45 },
    { rank: 24, user_name: "barkingdogs", position: "Lawyer", points: 20 },
  ];

  async created() {
    await this.fetchLeaderboardData();
    console.table(this.leaderboardData.withBots);
    console.table(this.leaderboardData.withoutBots);
  }

  async fetchLeaderboardData() {
    this.api = new LeaderboardAPI(this.$store, this.$ajax);
    this.leaderboardData = await this.api.getLeaderboardData();
  }
}
</script>

<style lang="scss" scoped>
#filter-options {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
