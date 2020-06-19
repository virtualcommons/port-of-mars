<template>
  <b-container class="tour-report">
    <b-row class="report">
      <b-col fluid cols="8" class="system-health tour-contribute">
        <h1 class="m-4">System Health Report</h1>
        <h2>Upcoming System Health: <b-badge :variant="systemHealthBadgeVariant">{{ nextRoundSystemHealth }}</b-badge></h2>
        <div v-if="isFirstRound">
          Welcome to Mars! Each round, your System Health degrades by <b>{{ systemHealthMaintenanceCost }}</b> due to standard wear and tear.
          Your System Health at the start of this round is <code>{{ nextRoundSystemHealth }}</code>.
        </div>
        <div v-else>
          <p>
          In the previous round you invested <b>{{ systemHealthContribution }}</b> and the rest of your group invested 
          <b>{{ groupContributions }}</b> in System Health for a total of {{ totalSystemHealthContributions }}.
           Your group's average investment was {{ averageContribution }}.
          </p>
          <p>
          {{ previousRoundSummary }}
          </p>
        </div>
        <b-table responsive sticky-header small dark bordered striped :items="tabularContributions" :fields="tabularContributionFields">
        </b-table>
      </b-col>
      <b-col fluid cols="4" class="events m-auto tour-report-hint">
        <h4>If System Health drops below 65, your group will encounter <b>two</b> Events.</h4>
        <h4>If System Health drops below 35, your group will encounter <b>three</b> Events.</h4>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import { Vue } from 'vue-property-decorator';
  import { PlayerClientData } from '@port-of-mars/client/store/state';
  import { SYSTEM_HEALTH_MAINTENANCE_COST } from '@port-of-mars/shared/settings';
  import _ from 'lodash';

  export default class NewRound extends Vue {

    get systemHealthBadgeVariant() {
      if (this.systemHealth >= 65) {
        return "success";
      }
      else if (this.systemHealth >= 35) {
        return "warning";
      }
      else {
        return "danger";
      }
    }

    get previousRoundSummary() {
      return "This will be a summary of the previous round... eventually!";
    }

    get currentRound() {
      return this.$tstore.state.round;
    }

    get systemHealthMaintenanceCost() {
      return SYSTEM_HEALTH_MAINTENANCE_COST;
    }

    get systemHealth() {
      return this.$tstore.getters.systemHealth;
    }

    get nextRoundSystemHealth() {
       return _.clamp(this.systemHealth - this.systemHealthMaintenanceCost, 0, 100);
    }

    get isFirstRound() {
      return this.$tstore.getters.isFirstRound;
    }

    get averageContribution() {
      return this.totalSystemHealthContributions / 5;
    }

    get systemHealthContribution() {
      return this.$tstore.getters.systemHealthContribution;
    }

    get tabularContributionFields() {
      return [{key: 'label'}, {key: 'value', class: 'text-md-right'}];
    }

    get tabularContributions() {
      const items = [
        {label: 'Prior System Health', value: this.systemHealth},
        {label: 'Group Contributions', value: this.groupContributions},
        {label: 'Wear and Tear', value: -this.systemHealthMaintenanceCost},
        {label: 'Upcoming System Health', value: this.nextRoundSystemHealth, _rowVariant: this.systemHealthBadgeVariant}
      ];
      const isUnderAudit = this.$tstore.getters.isUnderAudit;
      if (isUnderAudit) {
        items.splice(2, 0, ...this.otherPlayerContributions().concat({label: this.$tstore.getters.player.role, value: this.systemHealthContribution}));
      }
      // Next Round System Health = Previous System Health + Group Contributions - Wear and Tear
      return items;
    }

    otherPlayerContributions(): Array<{label:string, value:number}> {
      const contributions = [];
      for (const [role, player] of Object.entries(this.$tstore.getters.otherPlayers)) {
        contributions.push({label: role, value: (player as PlayerClientData).contributedUpkeep});
      }
      return contributions;
    }

    get groupContributions() {
      return _.sumBy(this.otherPlayerContributions(), 'value');
    }

    get totalSystemHealthContributions() {
      return this.systemHealthContribution + this.groupContributions;
    }
  }
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/NewRound.scss';
</style>
