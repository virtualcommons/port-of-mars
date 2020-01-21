<template>
  <div class="profile-investments tour-profile-investments">
    <p class="title">Your Investments</p>
    <div class="pi-container">
      <div v-for="investment in investments" :key="investment.name" class="profile-investment">
        <img :src="require(`@/assets/icons/${investment.name}.svg`)" alt="Investment" />
        <p>
          {{ investment.units
          }}<span v-show="investment.pendingUnits > 0"
            >+<span :style="style(investment)">{{ investment.pendingUnits }}</span></span
          >
        </p>
      </div>
      <div class="profile-investment">
        <img :src="require(`@/assets/icons/upkeep.svg`)" alt="Investment" />
        <p>
          {{ upkeep.units
          }}<span v-show="upkeep.pendingUnits > 0"
            >+<span :style="style(upkeep)">{{ upkeep.pendingUnits }}</span></span
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Resource, RESOURCES } from 'shared/types';

@Component({})
export default class ProfileInvestments extends Vue {
  get investments() {
    const p = this.$tstore.getters.player;
    const inventory = p.inventory;
    const pendingInventory = p.pendingInvestments;
    return RESOURCES.map(name => ({
      name,
      units: inventory[name as Resource],
      pendingUnits: pendingInventory[name as Resource]
    }));
  }

  get upkeep() {
    const p = this.$tstore.getters.player;
    const pendingInvestment = p.pendingInvestments;
    return {
      pendingUnits: pendingInvestment.upkeep,
      units: p.contributedUpkeep
    };
  }

  style(inventory: { units: number; pendingUnits: number }): string {
    return inventory.units < inventory.units + inventory.pendingUnits
      ? 'color: var(--status-green)'
      : '';
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/left/ProfileInvestments.scss';
</style>
