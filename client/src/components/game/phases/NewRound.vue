<template>
  <b-row class="h-100 w-100 m-0 p-0 report tour-report" align-v="center">
    <!-- system health information -->
    <b-col
      cols="6"
      class="d-flex flex-column h-100 w-100 tour-report-hint light-shade-25-partition"
    >
      <!-- header -->
      <b-row class="h-auto w-100 mx-auto p-3 justify-content-center header">
        <p class="m-auto">System Health Summary</p>
      </b-row>
      <!-- text info -->
      <b-row v-if="isFirstRound" class="flex-grow-1 flex-column w-100 mx-auto my-3 p-3 backdrop">
        <b-col>
          <h3 class="my-2">
            System Health
            <b-badge :variant="systemHealthBadgeVariant(nextRoundSystemHealth)">{{
              nextRoundSystemHealth
            }}</b-badge>
          </h3>
          <p class="my-2 lead">
            Welcome to Mars! Each round, your System Health degrades by
            <b-badge variant="danger">{{ systemHealthMaintenanceCost }}</b-badge>
            due to standard wear and tear.
          </p>
          <p>
            Your System Health at the start of this round was <b-badge variant="success">100</b-badge>.
            Applying standard wear and tear results in a current System Health of
            <b-badge variant="success">{{ nextRoundSystemHealth }}</b-badge>.
          </p>
        </b-col>
      </b-row>
      <b-row v-else class="flex-grow-1 flex-column w-100 mx-auto my-3 p-3 backdrop">
        <h3 class="my-2">
          System Health
          <b-badge :variant="systemHealthBadgeVariant(nextRoundSystemHealth)">
            {{ nextRoundSystemHealth }}
          </b-badge>
        </h3>
        <ul>
          <li>In the previous round you invested <b class="highlighted-number">{{ yourSystemHealthContributions }} System Health</b></li>
          <li>The rest of your group invested <b class="highlighted-number">{{ otherPlayerSystemHealthContributions }} System Health</b></li>
          <li>Total contributions: <b class='highlighted-number'>{{ totalSystemHealthGroupContributions }} System Health</b></li>
          <li>Average contributions: <b class='highlighted-number'>{{ averageContribution }} System Health</b></li>
          <li v-if="systemHealthAccomplishmentPurchasesCost < 0">
            Purchased Accomplishments last round cost
            <b class='highlighted-number'>{{ systemHealthAccomplishmentPurchasesCost }} System Health</b>.
          </li>
          <li v-if="systemHealthMarsEventsCost < 0">
            Mars Events cost 
            <b class='highlighted-number'>{{ systemHealthMarsEventsCost }} System Health</b>.
          </li>
          <li>Standard Wear and Tear: <b class='highlighted-number'>-25 System Health</b>.</li>
        </ul>
        <h4>
          Upcoming System Health Calculation 
        </h4>
        <h4>
          <b-badge :variant="systemHealthBadgeVariant(systemHealth)">
            {{ upcomingSystemHealthCalculation}}
          </b-badge>
        </h4>
      </b-row>
    </b-col>
    <!-- system health report -->
    <b-col cols="6" class="d-flex flex-column h-100 w-100 tour-contribute">
      <!-- header -->
      <b-row class="h-auto w-100 mx-auto p-3 justify-content-center header">
        <p class="m-auto">System Health Report</p>
      </b-row>
      <b-row align-h="center" class="flex-grow-1 flex-column w-100 mx-auto my-3 p-3 backdrop">
        <b-col>
          <div class="h-100 p-2 scrollable">
            <b-table-lite
              :fields="tabularContributionFields"
              :items="tabularContributions"
              fixed
              bordered
              dark
              striped
              responsive
            >
            </b-table-lite>
            <b-table-lite
              v-if="purchases.length > 0"
              :fields="purchaseFields"
              :items="purchases"
              fixed
              bordered
              dark
              striped
              responsive
            >
            </b-table-lite>
          </div>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import _ from "lodash";
import { RESOURCES, TradeAmountData } from "@port-of-mars/shared/types";

export default class NewRound extends Vue {
  systemHealthBadgeVariant(systemHealth: number) {
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
    return this.systemHealthGroupContributions.get(this.role) ?? 0;
  }

  get purchaseFields() {
    return [
      { key: "name", label: "Purchased Accomplishment" },
      { key: "victoryPoints" },
      { key: "systemHealthModification", label: "System Health" }
    ];
  }

  get purchases() {
    return this.roundIntroduction.accomplishmentPurchases;
  }

  get systemHealthAccomplishmentPurchasesCost() {
    return _.sum(this.purchases.map(p => p.systemHealthModification));
  }

  get upcomingSystemHealthCalculation() {
    let calculation = `${this.priorSystemHealth} + ${this.totalSystemHealthGroupContributions}`;
    if (this.systemHealthAccomplishmentPurchasesCost < 0) {
      calculation = calculation.concat(
        ` - ${Math.abs(this.systemHealthAccomplishmentPurchasesCost)}`
      );
    }
    if (this.systemHealthMarsEventsCost < 0) {
      calculation = calculation.concat(` - ${Math.abs(this.systemHealthMarsEventsCost)}`);
    }
    calculation = calculation.concat(` = ${this.systemHealth} - 25 = ${this.nextRoundSystemHealth}`);
    return calculation;
  }

  get trades() {
    return [];
  }

  get tabularContributionFields() {
    return [
      { key: "role", label: "Source" },
      { key: "label", label: "Description" },
      { key: "value", label: "System Health", class: "text-right" }
    ];
  }

  get tabularContributions() {
    const items = [
      {
        label: "Prior System Health",
        role: "System",
        value: this.priorSystemHealth
      },
      {
        label: "Group Contributions",
        role: "Players",
        value: this.totalSystemHealthGroupContributions
      }
    ];
    if (this.systemHealthAccomplishmentPurchasesCost !== 0) {
      items.push({
        role: "Players",
        label: "Accomplishments that cost System Health",
        value: this.systemHealthAccomplishmentPurchasesCost
      });
    }
    items.push(...this.systemHealthMarsEvents);
    items.push({
      role: "System",
      label: "Wear and Tear",
      value: this.systemHealthMaintenanceCost
    });
    items.push({
      label: "Upcoming System Health",
      role: "System",
      value: this.nextRoundSystemHealth
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
    return this.roundIntroduction.systemHealthMarsEvents.map(
      ({ label, systemHealthModification }) => ({
        label,
        role: "Mars Event",
        value: systemHealthModification
      })
    );
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
    return resources;
  }

  playerContributionAuditInfo(): Array<{ label: string; role: string; value: number }> {
    const contributions: ReturnType<typeof this.playerContributionAuditInfo> = [];
    this.systemHealthGroupContributions.forEach((investment: number, role: string) => {
      contributions.push({
        label: "System Health",
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

.highlighted-number {
  color: var(--light-accent);
}
</style>
