<template>
  <div class="w-100 h-100 inventory">
    <div class="toggle">
      <p>Toggle Resource Costs</p>
      <button @click="toggleCosts" :class="costTogglerClass">
        <font-awesome-icon
          :icon="['fas', 'clock']"
          size="sm"
          class="timeblock"
        />
      </button>
    </div>
    <div
      v-for="investment in investments"
      :key="investment.name"
      :style="backgroundColor(investment.name)"
      class="investment"
    >
      <div class="left">
        <p v-if="costsVisible" class="cost mx-2" v-b-tooltip.hover.bottom title="Time Block Cost">
          {{ canInvest(investment.cost) ? investment.cost : '-' }}
        </p>
        <font-awesome-icon
          v-if="costsVisible"
          :icon="['fas', 'clock']"
          size="lg"
          class="timeblock mr-3"
        />
        <img
          :src="
            require(`@port-of-mars/client/assets/icons/${investment.name}.svg`)
          "
          alt="Investment"
        />
        <p>{{ investment.name }}</p>
      </div>
      <div class="right">
        <font-awesome-icon
          :icon="['fas', 'briefcase']"
          size="lg"
          class="inventory"
        />
        <p class="units" v-b-tooltip.hover.bottom title="Inventory Amount">{{ investment.units }}</p>
      </div>
    </div>

    <div
      v-if="displaySystemHealth"
      :style="backgroundColor('upkeep')"
      class="investment"
    >
      <div class="left">
        <img
          :src="require(`@port-of-mars/client/assets/icons/upkeep.svg`)"
          alt="Investment"
        />
        <p>{{ contributedSystemHealth.name }}</p>
      </div>
      <div class="right">
        <font-awesome-icon
          v-if="costsVisible"
          :icon="['fas', 'clock']"
          size="lg"
          class="timeblock"
        />
        <p v-if="costsVisible" class="cost">
          {{
            canInvest(contributedSystemHealth.cost)
              ? contributedSystemHealth.cost
              : '-'
          }}
        </p>
        <font-awesome-icon
          :icon="['fas', 'briefcase']"
          size="lg"
          class="inventory"
        />
        <p class="units">{{ contributedSystemHealth.units }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Role, RESEARCHER } from '@port-of-mars/shared/types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons/faBriefcase';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  Investment,
  Resource,
  RESOURCES,
  Phase,
} from '@port-of-mars/shared/types';
import {COST_INAFFORDABLE} from "@port-of-mars/shared/settings";

library.add(faClock);
library.add(faBriefcase);

Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {},
})
export default class Inventory extends Vue {
  @Prop({ default: true }) private isSelf!: boolean;
  @Prop({ default: RESEARCHER }) private role!: Role;
  @Prop({ default: false }) private displaySystemHealth!: boolean;
  private costsVisible: boolean = this.$tstore.state.userInterface.toggleResourceCost;

  get playerData() {
    return this.isSelf
      ? this.$tstore.getters.player
      : this.$tstore.state.players[this.role];
  }

  get investments() {
    const p = this.playerData;
    const inventory = p.inventory;
    const pendingInventory = p.pendingInvestments;
    const costs = p.costs;
    return RESOURCES.map((name) => ({
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
      name: 'System Health',
      units: p.systemHealthChanges.investment,
      pendingUnits: pendingInvestment.upkeep,
      cost: costs.upkeep,
    };
  }

  private canInvest(cost: number): boolean {
    return cost < COST_INAFFORDABLE;
  }

  private toggleCosts() {
    this.$tstore.commit('SET_RESOURCE_COSTS_VISIBLE', !this.costsVisible);
    this.costsVisible = this.$tstore.state.userInterface.toggleResourceCost;
  }

  get costTogglerClass() {
    return this.costsVisible ? 'active' : 'inactive';
  }

  private backgroundColor(resource: Investment) {
    let color;
    switch (resource) {
      case 'culture':
        color = 'var(--color-Curator)';
        break;
      case 'finance':
        color = 'var(--color-Entrepreneur)';
        break;
      case 'government':
        color = 'var(--color-Politician)';
        break;
      case 'legacy':
        color = 'var(--color-Pioneer)';
        break;
      case 'science':
        color = 'var(--color-Researcher)';
        break;
      case 'upkeep':
        color = 'var(--color-Upkeep)';
        break;
      default:
        color = 'var(--light-shade-05)';
    }
    return { backgroundColor: color };
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/Inventory.scss';
</style>
