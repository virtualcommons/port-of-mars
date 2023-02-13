<template>
  <b-row class="flex-column h-100 w-100 m-0 p-2 justify-content-center">
    <!--    <b-row class="h-auto w-100 m-0 p-0 justify-content-center">-->
    <b-button v-if="!hideCosts" block squared variant="outline-secondary" @click="toggleCosts">
      Show Costs
    </b-button>
    <!--    </b-row>-->
    <b-row
      v-for="investment in investments"
      :key="investment.name"
      :style="backgroundColor(investment.name)"
      class="w-100 m-0 p-3 justify-content-between align-items-center"
    >
      <!-- costs -->
      <b-col v-if="!hideCosts" v-show="costsVisible" md="4" class="m-0 p-0 text-left">
        <p v-b-tooltip.hover.bottom class="mx-2 my-auto" title="Time Block Cost">
          <span v-if="canInvest(investment.cost)">
            {{ investment.cost }} <b-icon-clock-fill class="ml-1"></b-icon-clock-fill>
          </span>
          <span v-else>N/A</span>
        </p>
      </b-col>
      <!-- influence -->
      <b-col md="4" :lg="costsVisible ? 6 : 10" class="m-0 p-0 text-left">
        <p class="my-auto">
          <img
            :src="require(`@port-of-mars/client/assets/icons/${investment.name}.svg`)"
            alt="Influence"
            style="height: 2rem; width: 2rem"
          />
          {{ investment.name }}
        </p>
      </b-col>
      <!-- inventory amount -->
      <b-col md="4" lg="2" class="m-0 p-0">
        <p v-b-tooltip.hover.bottom class="my-auto" title="Inventory Amount">
          <b-icon-bag-fill></b-icon-bag-fill>
          <span class="ml-2">{{ investment.units }}</span>
        </p>
      </b-col>
    </b-row>
  </b-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Role, RESEARCHER } from "@port-of-mars/shared/types";
import { Investment, Resource, RESOURCES, Phase } from "@port-of-mars/shared/types";
import { Constants } from "@port-of-mars/shared/settings";

@Component({
  components: {},
})
export default class Inventory extends Vue {
  @Prop({ default: true }) isSelf!: boolean;
  @Prop({ default: RESEARCHER }) role!: Role;
  @Prop({ default: false }) displaySystemHealth!: boolean;
  @Prop({ default: false }) hideCosts!: boolean;
  costsVisible: boolean = this.$tstore.state.userInterface.toggleResourceCost;

  get playerData() {
    return this.isSelf ? this.$tstore.getters.player : this.$tstore.state.players[this.role];
  }

  get investments() {
    const p = this.playerData;
    const inventory = p.inventory;
    const pendingInventory = p.pendingInvestments;
    const costs = p.costs;
    return RESOURCES.map(name => ({
      name,
      units: inventory[name as Resource],
      pendingUnits: pendingInventory[name as Resource],
      cost: costs[name as Resource],
    }));
  }

  get contributedSystemHealth() {
    const p = this.playerData;
    const pendingInvestment = p.pendingInvestments;
    const costs = p.costs;
    return {
      name: "System Health",
      units: p.systemHealthChanges.investment,
      pendingUnits: pendingInvestment.systemHealth,
      cost: costs.systemHealth,
    };
  }

  get costTogglerClass() {
    return this.costsVisible ? "active" : "inactive";
  }

  get isPurchaseOrDiscardPhase() {
    return Phase.purchase || Phase.discard;
  }

  canInvest(cost: number): boolean {
    return cost < Constants.MAXIMUM_COST;
  }

  toggleCosts() {
    this.$tstore.commit("SET_RESOURCE_COSTS_VISIBLE", !this.costsVisible);
    this.costsVisible = this.$tstore.state.userInterface.toggleResourceCost;
  }

  backgroundColor(resource: Investment) {
    let color;
    switch (resource) {
      case "culture":
        color = "var(--color-Curator)";
        break;
      case "finance":
        color = "var(--color-Entrepreneur)";
        break;
      case "government":
        color = "var(--color-Politician)";
        break;
      case "legacy":
        color = "var(--color-Pioneer)";
        break;
      case "science":
        color = "var(--color-Researcher)";
        break;
      case "systemHealth":
        color = "var(--color-Upkeep)";
        break;
      default:
        color = "var(--light-shade-05)";
    }
    return { backgroundColor: color };
  }
}
</script>
