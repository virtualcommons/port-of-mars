<template>
  <b-row class="flex-column h-100 w-100 m-0 p-1 justify-content-center">
    <b-row class="h-auto w-100 m-0 p-0 justify-content-center" style="background-color: rgb(156, 81, 71)">
      <p class="my-auto p-0 mx-2" style="color: rgb(34, 26, 27)">Toggle Resource Costs</p>
      <b-button size="lg" icon pill style="background-color: transparent; border-radius: 50%;"
                @click="toggleCosts">
        <b-icon-clock v-if="!costsVisible" scale="1" variant="light"></b-icon-clock>
        <b-icon-clock-fill v-else-if="costsVisible" scale="1" variant="light"></b-icon-clock-fill>
      </b-button>
    </b-row>
    <b-row v-for="investment in investments"
           :key="investment.name"
           :style="backgroundColor(investment.name)"
           class="w-100 m-0 p-2 justify-content-between align-items-center"
    >
      <!-- costs -->
      <b-col v-if="costsVisible" class="m-0 p-0 text-left">
        <p v-b-tooltip.hover.bottom class="mx-2 my-auto" title="Time Block Cost">
          {{ canInvest(investment.cost) ? investment.cost : '-' }}
          <font-awesome-icon
            v-if="costsVisible"
            :icon="['fas', 'clock']"
            class="mx-2"
            style="color: rgb(241, 224, 197)"
          />
        </p>
      </b-col>
      <!-- influence -->
      <b-col class="m-0 p-0 text-left">
        <p class="my-auto">
          <img
            :class="costsVisible ? '' : 'mx-2'"
            :src="
            require(`@port-of-mars/client/assets/icons/${investment.name}.svg`)
          "
            alt="Influence"
            style="height: 2rem; width: 2rem;"
          />
          {{ investment.name }}
        </p>
      </b-col>
      <!-- inventory amount -->
      <b-col class="p-0 m-0 text-right">
        <p v-b-tooltip.hover.bottom class="mx-3 my-auto" title="Inventory Amount">
          <font-awesome-icon
            :icon="['fas', 'briefcase']"
            class="mx-2"
          />
          {{ investment.units }}
        </p>
      </b-col>
    </b-row>

    <!--    <div-->
    <!--      v-if="displaySystemHealth"-->
    <!--      :style="backgroundColor('systemHealth')"-->
    <!--      class="investment"-->
    <!--    >-->
    <!--      <div class="left">-->
    <!--        <img-->
    <!--          :src="require(`@port-of-mars/client/assets/icons/systemHealth.svg`)"-->
    <!--          alt="Investment"-->
    <!--        />-->
    <!--        <p>{{ contributedSystemHealth.name }}</p>-->
    <!--      </div>-->
    <!--      <div class="right">-->
    <!--        <font-awesome-icon-->
    <!--          v-if="costsVisible"-->
    <!--          :icon="['fas', 'clock']"-->
    <!--          size="lg"-->
    <!--          class="timeblock"-->
    <!--        />-->
    <!--        <p v-if="costsVisible" class="cost">-->
    <!--          {{-->
    <!--            canInvest(contributedSystemHealth.cost)-->
    <!--              ? contributedSystemHealth.cost-->
    <!--              : '-'-->
    <!--          }}-->
    <!--        </p>-->
    <!--        <font-awesome-icon-->
    <!--          :icon="['fas', 'briefcase']"-->
    <!--          size="lg"-->
    <!--          class="inventory"-->
    <!--        />-->
    <!--        <p class="units">{{ contributedSystemHealth.units }}</p>-->
    <!--      </div>-->
    <!--    </div>-->
  </b-row>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {Role, RESEARCHER} from '@port-of-mars/shared/types';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faClock} from '@fortawesome/free-solid-svg-icons/faClock';
import {faBriefcase} from '@fortawesome/free-solid-svg-icons/faBriefcase';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
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
  @Prop({default: true}) private isSelf!: boolean;
  @Prop({default: RESEARCHER}) private role!: Role;
  @Prop({default: false}) private displaySystemHealth!: boolean;
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
      pendingUnits: pendingInvestment.systemHealth,
      cost: costs.systemHealth,
    };
  }

  get costTogglerClass() {
    return this.costsVisible ? 'active' : 'inactive';
  }

  private canInvest(cost: number): boolean {
    return cost < COST_INAFFORDABLE;
  }

  private toggleCosts() {
    this.$tstore.commit('SET_RESOURCE_COSTS_VISIBLE', !this.costsVisible);
    this.costsVisible = this.$tstore.state.userInterface.toggleResourceCost;
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
      case 'systemHealth':
        color = 'var(--color-Upkeep)';
        break;
      default:
        color = 'var(--light-shade-05)';
    }
    return {backgroundColor: color};
  }
}
</script>
