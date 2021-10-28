<template>
  <b-row class="h-100 w-100 report tour-report" align-v="center">
      <!-- system health report -->
      <b-col class="d-flex flex-column h-100 w-100 system-health tour-contribute" cols="8">
        <!-- header -->
        <b-row class="h-auto w-100 my-2 mx-0 p-3 justify-content-center" style="background-color: var(--main-brand)">
          <p class="my-auto p-0 mx-2" style="color: rgb(34, 26, 27)">System Health Report</p>
        </b-row>

        <b-row class="flex-grow-1 flex-column w-100 m-0 p-3 justify-content-center tour-wear-tear"
               style="background-color: var(--light-shade-05);"
        >
          <!-- text info -->
          <b-col class="flex-shrink-1 w-100 m-0 p-0" v-if="isFirstRound">
            <h2 class="my-2">Upcoming System Health:
              <b-badge :variant="systemHealthBadgeVariant">{{ nextRoundSystemHealth }}</b-badge>
            </h2>
            <p>Welcome to Mars! Each round, your System Health degrades by
              <b class="highlighted-number">{{ systemHealthMaintenanceCost }}</b> due to standard wear and tear. Your System
              Health at the start of this round is <b class="highlighted-number">
                {{ nextRoundSystemHealth }}</b>.
            </p>
          </b-col>
          <b-col class="flex-shrink-1 w-100 m-0 p-0" v-else>
            <p>
              In the previous round you invested <b class="highlighted-number">{{ yourSystemHealthContributions }}</b> and the rest
              of your group invested
              <b class="highlighted-number">{{ otherPlayerSystemHealthContributions }}</b> in System Health for a total of {{totalSystemHealthGroupContributions}}.
              Your group's average investment was {{ averageContribution }}.
              <span v-if="systemHealthAccomplishmentPurchasesCost < 0">
                Accomplishments were purchased that cost a total of {{ systemHealthAccomplishmentPurchasesCost }} System Health.
              </span>
              <br />
              <b>
                Your final System Health at the end of last round was <b-badge :variant="systemHealthBadgeVariant(systemHealth)">{{ lastRoundSystemHealthCalculation }}</b-badge>.
                After standard wear and tear, your starting System Health this round is 
                <b-badge :variant="systemHealthBadgeVariant(nextRoundSystemHealth)">{{nextRoundSystemHealth}}</b-badge>.
              </b>
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
                       striped>
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
            <h4 class="mx-3 my-0">If System Health drops below 65, your group will encounter <b><span style="color: var(--light-accent)">2 events</span></b>.</h4>
            <h4 class="mx-3 my-5">If System Health drops below 35, your group will encounter <b><span style="color: var(--light-accent)">3 events</span></b>.</h4>
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

  systemHealthBadgeVariant(systemHealth) {
    if (systemHealth >= 65) {
      return "success";
    } else if (systemHealth >= 35) {
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

  get role() {
    return this.$tstore.getters.player.role;
  }

  get nextRoundSystemHealth() {
    // FIXME: figure out a way to make this clearer
    return _.clamp(this.systemHealth + this.systemHealthMaintenanceCost, 0, 100);
  }

  get isFirstRound() {
    return this.$tstore.getters.isFirstRound;
  }

  get averageContribution() {
    return this.totalSystemHealthGroupContributions / 5;
  }

  get yourSystemHealthContributions() {
    return this.systemHealthGroupContributions.get(this.role)?? 0;
  }

  get purchaseFields() {
    return [{key: 'name', label: 'Purchased Accomplishment'}, {key: 'victoryPoints'}, {key: 'systemHealthModification', label: 'System Health'}]
  }

  get purchases() {
    return this.roundIntroduction.accomplishmentPurchases;
  }

  get systemHealthAccomplishmentPurchasesCost() {
    return _.sum(this.purchases.map(p => p.systemHealthModification));
  }

  get lastRoundSystemHealthCalculation() {
    // {{ priorSystemHealth }} + {{ systemHealthGroupContributions }} {{ systemHealth }}</code>.
    let calculation = `${this.priorSystemHealth} + ${this.totalSystemHealthGroupContributions}`;
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
    return [
      {key: 'role', label: 'Source'},
      {key: 'label', label: 'Description'},
      {key: 'value', label: 'System Health', class: 'text-right'}
    ];
  }

  get tabularContributions() {
    const items = [
      {
        label: 'Prior System Health', role: 'System', value: this.priorSystemHealth
      },
      {
        label: 'Group Contributions', role: 'Players', value: this.totalSystemHealthGroupContributions
      },
    ];
    if (this.systemHealthAccomplishmentPurchasesCost !== 0) {
      items.push({
        role: 'Players',
        label: 'Accomplishments that cost System Health',
        value: this.systemHealthAccomplishmentPurchasesCost
      });
    }
    items.push(...this.systemHealthMarsEvents);
    items.push({
      role: 'System',
      label: 'Wear and Tear',
      value: this.systemHealthMaintenanceCost
    });
    items.push({
      label: 'Upcoming System Health',
      role: 'System',
      value: this.nextRoundSystemHealth,
    });
    const isUnderAudit = this.$tstore.getters.isUnderAudit;
    if (isUnderAudit) {
      items.splice(2, 0, ...this.playerContributionAuditInfo());
    }
    // Next Round System Health = Previous System Health + Group Contributions - Wear and Tear
    console.log("tabular contributions:", items);
    return items;
  }

  get otherPlayerSystemHealthContributions() {
    return this.totalSystemHealthGroupContributions - this.yourSystemHealthContributions;
  }

  get totalSystemHealthGroupContributions() {
    return _.sum(Array.from(this.systemHealthGroupContributions.values()));
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

  playerContributionAuditInfo(): Array<{ label: string, role: string, value: number }> {
    const contributions: ReturnType<typeof this.playerContributionAuditInfo> = [];
    this.systemHealthGroupContributions.forEach((investment: number, role: string) => {
      contributions.push({
        label: 'System Health',
        role,
        value: investment
      });
    });
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

.highlighted-number {
  color: var(--light-accent)
}
</style>
