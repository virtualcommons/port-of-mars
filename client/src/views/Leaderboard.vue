<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 overflow-auto backdrop">
    <div class="h-100 m-auto p-5" style="max-width: 1200px">
      <b-row class="h-100 m-0">
        <b-col cols="12" class="mh-100 p-2">
          <b-tabs content-class="mt-3">
            <b-tab title="Leaderboard" active>
              <div id="filter-options" class="p-2">
              <b-form-checkbox v-model="showWithBots" name="check-button" class="mx-3">
                Include games with bots
              </b-form-checkbox>
              </div>
              <div class="h-100-header w-100 content-container">
                <LeaderboardTable :showWithBots="showWithBots" :limit="50" />
              </div>
            </b-tab>
            <b-tab title="High Scores">
              <div class="h-100-header w-100 content-container">
                <HighScoreTable :limit="50" />
              </div>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LeaderboardTable from "@port-of-mars/client/components/stats/LeaderboardTable.vue";
import HighScoreTable from "@port-of-mars/client/components/stats/HighScoreTable.vue";

@Component({
  components: {
    LeaderboardTable,
    HighScoreTable
  },
})
export default class Leaderboard extends Vue {
  showWithBots = false;
}
</script>

<style lang="scss" scoped>
#filter-options {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
