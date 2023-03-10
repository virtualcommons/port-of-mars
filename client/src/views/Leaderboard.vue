<!-- Initializes table -->
<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 overflow-auto backdrop">
    <div class="h-100 w-100 p-3">
      <b-row class="h-100 w-100 m-0">
        <b-col cols="12" class="mh-100 p-2">
          <h4 class="header-nowrap">Leaderboard</h4>
          <div id="filter-options" class="p-2">
            <b-form-checkbox v-model="showWithBots" name="check-button" class="mx-3">
              Include games with bots
            </b-form-checkbox>
            <!--<div>State: <strong>{{ showWithBots }}</strong></div> -->
          </div>
          <div class="h-100-header w-100 content-container">
            <b-table
              dark
              sticky-header
              style="max-height: none"
              class="h-100 m-0 custom-table"
              :fields="leaderboardFields"
              :items="showWithBots ? leaderboardData.withBots : leaderboardData.withoutBots"
              sort-by="rank"
              :sort-asc="true"
            >
              <!-- custom columns with scoped slots https://bootstrap-vue.org/docs/components/table#custom-data-rendering -->
              <!-- TODO: add styling ~experiment away -->
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

  showWithBots = true;

  leaderboardData: LeaderboardData = {
    withBots: [],
    withoutBots: [],
  };
  leaderboardFields: any = [
    {
      key: "rank",
      sortable: true,
    },
    {
      key: "username",
      sortable: true,
    },
    { key: "points" },
    { key: "wins" },
    { key: "losses" },
  ]; // FIXME: (FINISHED) add the rest of leaderboard item fields (shared/types.ts file)
  // FIXME: (FINISHED) expand to array of objects w/ additional properties https://bootstrap-vue.org/docs/components/table#fields-as-an-array-of-objects

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
