<template>
  <b-container class="h-100 w-100 tour-report" fluid>
    <b-row align-v="center" class="h-100 report">
      <b-col class="h-100 w-100 system-health tour-contribute" cols="8">
        <b-container class="p-3 mt-3 outer tour-wear-tear tour-shr-table" fluid>
          <h1 class="mb-3 mx-1">System Health Report</h1>
          <h2 class="mb-3 mx-1">Upcoming System Health:
            <b-badge :variant="systemHealthBadgeVariant">{{ nextRoundSystemHealth }}</b-badge>
          </h2>
          <b-row v-if="isFirstRound" class="mx-1">
            <p>Welcome to Mars! Each round, your System Health degrades by <b>{{
                systemHealthMaintenanceCost
              }}</b> due to standard wear and tear.
              Your System Health at the start of this round is <b><code>{{ nextRoundSystemHealth }}</code></b>.</p>
          </b-row>
          <b-row class="mx-1" v-else>
            <p>
              In the previous round you invested <b>{{ yourSystemHealthContributions }}</b> and the rest
              of your group invested
              <b>{{ otherPlayerSystemHealthContributions }}</b> in System Health for a total of {{
                systemHealthGroupContributions
              }}.
              Your group's average investment was {{ averageContribution }}.
            </p>
          </b-row>
          <b-row class="mx-1">
            <b-table :fields="tabularContributionFields" :items="tabularContributions" bordered dark
                     small striped>
            </b-table>
            <b-table v-if="purchases.length > 0" :fields="purchaseFields" :items="purchases" bordered dark small sticky-header
                     striped>
            </b-table>
          </b-row>
        </b-container>
      </b-col>
      <b-col class="h-100 w-100 tour-report-hint" cols="4">
        <b-container class="py-5 mt-3 outer" fluid>
          <h4 class="py-4 my-4">If System Health drops below 65, your group will encounter <b><code>2 events</code></b></h4>
          <h4>If System Health drops below 35, your group will encounter <b><code>3 events</code></b>.</h4>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import {Vue} from 'vue-property-decorator';
import {PlayerClientData} from '@port-of-mars/shared/game/client/state';
import _ from 'lodash';
import {RESOURCES, TradeAmountData} from "@port-of-mars/shared/types";

export default class NewRound extends Vue {

  get systemHealthBadgeVariant() {
    if (this.systemHealth >= 65) {
      return "success";
    } else if (this.systemHealth >= 35) {
      return "warning";
    } else {
      return "danger";
    }
  }

  get currentRound() {
    return this.$tstore.state.round;
  }

  get systemHealthMaintenanceCost(): number {
    return this.roundIntroduction.systemHealthMaintenanceCost;
  }

  get roundIntroduction() {
    return this.$tstore.state.roundIntroduction;
  }

  get priorSystemHealth() {
    return this.roundIntroduction.systemHealthAtStartOfRound;
  }

  get systemHealth() {
    return this.$tstore.getters.systemHealth;
  }

  get nextRoundSystemHealth() {
    // FIXME: figure out a way to make this clearer
    return _.clamp(this.systemHealth + this.systemHealthMaintenanceCost, 0, 100);
  }

  get isFirstRound() {
    return this.$tstore.getters.isFirstRound;
  }

  get averageContribution() {
    return this.systemHealthGroupContributions / 5;
  }

  get yourSystemHealthContributions() {
    return this.$tstore.getters.systemHealthContributed;
  }

  get purchaseFields() {
    return [{key: 'name', label: 'Accomplishment'}, {key: 'victoryPoints'}]
  }

  get purchases() {
    return this.roundIntroduction.accomplishmentPurchases;
  }

  get trades() {
    return [];
  }

  get tabularContributionFields() {
    return [{key: 'label', label: 'Description'}, {key: 'role'}, {
      key: 'value',
      label: 'System Health',
      class: 'text-md-right'
    }];
  }

  get tabularContributions() {
    const items = [
      {label: 'Prior System Health', role: 'System', value: this.priorSystemHealth},
      {
        label: 'Group Contributions', role: 'Players', value: this.systemHealthGroupContributions
      },
      ...this.$tstore.getters.purchaseSystemHealth,
      ...this.systemHealthMarsEvents,
      {label: 'Wear and Tear', role: 'System', value: this.systemHealthMaintenanceCost},
      {
        label: 'Upcoming System Health',
        role: 'System',
        value: this.nextRoundSystemHealth,
        _rowVariant: this.systemHealthBadgeVariant
      }
    ];
    const isUnderAudit = this.$tstore.getters.isUnderAudit;
    if (isUnderAudit) {
      items.splice(2, 0, ...this.otherPlayerContributionsInfo().concat({
        label: 'System Health',
        role: this.$tstore.getters.player.role,
        value: this.yourSystemHealthContributions
      }));
    }
    // Next Round System Health = Previous System Health + Group Contributions - Wear and Tear
    return items;
  }

  get otherPlayerSystemHealthContributions() {
    return this.systemHealthGroupContributions - this.yourSystemHealthContributions;
  }

  get systemHealthGroupContributions() {
    return this.roundIntroduction.systemHealthGroupContributions;
  }

  get systemHealthMarsEvents() {
    return this.roundIntroduction.systemHealthMarsEvents.map(({label, systemHealthModification}) => ({
      label,
      role: 'Mars Event',
      value: systemHealthModification
    }));
  }

  getTradeAmount(tradeAmount: TradeAmountData) {
    const resources = [];
    for (const r of RESOURCES) {
      if (tradeAmount.resourceAmount[r] !== 0) {
        resources.push(`${r} ${tradeAmount.resourceAmount[r]}`);
      }
    }
    return resources
  }

  otherPlayerContributionsInfo(): Array<{ label: string, role: string, value: number }> {
    const contributions = [];
    for (const [role, player] of Object.entries(this.$tstore.getters.otherPlayers)) {
      contributions.push({
        label: 'System Health',
        role,
        value: (player as PlayerClientData).systemHealthChanges.investment
      });
    }
    return contributions;
  }

}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/NewRound.scss';
</style>
