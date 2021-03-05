<template>
  <b-row class="h-100 w-100 report tour-report" align-v="center">
      <!-- system health report -->
      <b-col class="d-flex flex-column h-100 w-100 system-health tour-contribute" cols="8">
        <!-- header -->
        <b-row class="h-auto w-100 my-2 mx-0 p-3 justify-content-center" style="background-color: var(--main-brand)">
          <p class="my-auto p-0 mx-2" style="color: rgb(34, 26, 27)">System Health Report</p>
        </b-row>

        <b-row class="flex-grow-1 flex-column w-100 m-0 p-3 justify-content-center tour-wear-tear tour-shr-table"
               style="background-color: var(--light-shade-05);"
        >
          <!-- text info -->
          <b-col class="flex-shrink-1 w-100 m-0 p-0" v-if="isFirstRound">
            <h2 class="my-2">Upcoming System Health:
              <b-badge :variant="systemHealthBadgeVariant">{{ nextRoundSystemHealth }}</b-badge>
            </h2>
            <p>Welcome to Mars! Each round, your System Health degrades by
              <b>{{ systemHealthMaintenanceCost }}</b> due to standard wear and tear. Your System
              Health at the start of this round is <b><code>{{ nextRoundSystemHealth }}</code></b>.
            </p>
          </b-col>
          <b-col class="flex-shrink-1 w-100 m-0 p-0" v-else>
            <p>
              In the previous round you invested <b><code>{{ yourSystemHealthContributions }}</code></b> and the rest
              of your group invested
              <b><code>{{ otherPlayerSystemHealthContributions }}</code></b> in System Health for a total of {{systemHealthGroupContributions}}.
              Your group's average investment was {{ averageContribution }}.
              <span v-if="systemHealthAccomplishmentPurchasesCost < 0">
                Accomplishments were purchased that cost {{ systemHealthAccomplishmentPurchasesCost }} System Health.
              </span>
              <br>
              <b>Your final System Health at the end of last round was <code>{{ lastRoundSystemHealthCalculation }}</code></b>.
            </p>
          </b-col>
          <!-- table -->
          <b-col class="w-100 p-0 m-0">
            <div class="w-100 position-absolute m-0" style="overflow-y: auto; overflow-x: hidden;
                 max-height: 100%">
              <b-table :fields="tabularContributionFields" :items="tabularContributions" bordered dark
                       small striped>
              </b-table>
              <b-table v-if="purchases.length > 0" :fields="purchaseFields" :items="purchases" bordered dark small sticky-header
                       striped >
              </b-table>
            </div>
          </b-col>
        </b-row>
      </b-col>
      <!-- system health information -->
      <b-col class="d-flex flex-column h-100 w-100 tour-report-hint" cols="4">
        <!-- header -->
        <b-row class="h-auto w-100 my-2 mx-0 p-3 justify-content-center" style="background-color: var(--main-brand)">
          <p class="my-auto p-0 mx-2" style="color: rgb(34, 26, 27)">Information</p>
        </b-row>
        <b-row class="flex-grow-1 w-100 m-0 p-0 align-items-center"
               style="background-color: var(--light-shade-05)">
          <b-col class="w-100 m-0 p-0">
            <h4 class="mx-3 my-0">If System Health drops below 65, your group will encounter <b><code>2 events</code></b>.</h4>
            <h4 class="mx-3 my-5">If System Health drops below 35, your group will encounter <b><code>3 events</code></b>.</h4>
          </b-col>
        </b-row>
      </b-col>
  </b-row>
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

  get systemHealthAccomplishmentPurchasesCost() {
    return _.sum(this.$tstore.getters.systemHealthAccomplishmentPurchases.map(p => p.value));
  }

  get lastRoundSystemHealthCalculation() {
    // {{ priorSystemHealth }} + {{ systemHealthGroupContributions }} {{ systemHealth }}</code>.
    let calculation = `${this.priorSystemHealth} + ${this.systemHealthGroupContributions}`;
    if (this.systemHealthAccomplishmentPurchasesCost < 0) {
      calculation = calculation.concat(` - ${Math.abs(this.systemHealthAccomplishmentPurchasesCost)}`);
    }
    if (this.systemHealthMarsEventsCost < 0) {
      calculation = calculation.concat(` - ${Math.abs(this.systemHealthMarsEventsCost)}`);
    }
    calculation = calculation.concat(` = ${this.systemHealth}`);
    return calculation;
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
      ...this.$tstore.getters.systemHealthAccomplishmentPurchases,
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

  get systemHealthMarsEventsCost() {
    return _.sum(this.systemHealthMarsEvents.map(e => e.value));
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
.report {
  color: white;
}

.system-health {
  border-right: .2rem solid;
  border-color: $light-shade-25;
}

</style>
