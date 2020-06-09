<template>
  <b-container class="tour-report">
    <b-row class="report">
      <b-col fluid cols="8" class="system-health tour-contribute">
        <h1 class="m-4">System Health Report</h1>
        <h2>Health Contributions</h2>
        <p class="calc">(combined time blocks invested - purchased accomplishments that affect system health)</p>
        <h4> {{ contributedSystemHealth }}</h4>
      </b-col>
      <b-col fluid cols="4" class="events m-auto tour-report-hint">
        <h4>If System Health < 65, 2 Events occur.</h4>
        <h4>If System Health < 35, 3 Events occur.</h4>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import { Vue } from 'vue-property-decorator';

  export default class NewRound extends Vue {

    get contributedSystemHealth() {
      return this.$tstore.getters.contributedSystemHealth;
    }
  }
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/NewRound.scss';
</style>
