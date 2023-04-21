<template>
  <b-container fluid class="h-100 w-100 m-0 p-0 overflow-auto backdrop">
    <div class="h-100 m-auto p-5" style="max-width: 1200px">
      <b-row class="h-100 m-0">
        <b-col cols="12" class="mh-100 p-2">
          <h4 class="header-nowrap mb-3">Leaderboard</h4>
          <div id="filter-options" class="p-2">
            <b-form-checkbox v-model="showWithBots" name="check-button" class="mx-3">
              Include games with bots
            </b-form-checkbox>
          </div>
          <div class="h-100-header w-100 content-container">
            <LeaderboardTable :showWithBots="showWithBots" :limit="50" />
          </div>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LeaderboardTable from "@port-of-mars/client/components/leaderboard/LeaderboardTable.vue";

@Component({
  components: {
    LeaderboardTable,
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
