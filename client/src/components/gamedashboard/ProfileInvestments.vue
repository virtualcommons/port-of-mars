<template>
  <div class="profile-investments-container">
    <p class="profile-investments-title">Investments</p>
    <div class="profile-investments">
      <div v-for="investment in investments" class="profile-investment" :key="investment.name">
        <img :src="require(`@/assets/iconsSVG/${investment.name}.svg`)" alt="Investment" />
        <p>
          {{ investment.units
          }}<span v-show="investment.pendingUnits > 0"
            >+<span :style="style(investment)">{{ investment.pendingUnits }}</span></span
          >
        </p>
      </div>
      <div class="profile-investment">
        <img :src="require(`@/assets/iconsSVG/upkeep.svg`)" alt="Investment" />
        <p>{{ upkeep.units }}<span v-show="upkeep.pendingUnits > 0">+<span :style="style(upkeep)">{{ upkeep.pendingUnits }}</span></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import {Resource, RESOURCES} from 'shared/types';

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
    }
  }

  style(inventory: { units: number; pendingUnits: number }): string {
    return inventory.units < inventory.units + inventory.pendingUnits
      ? 'color: var(--status-green)'
      : '';
  }
}
</script>

<style scoped>
.profile-investments-container {
  width: 100%;
  padding: 0.5rem;
  /* border: 0.125rem solid var(--space-white-opaque-2); */
}

.profile-investments-title {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: var(--font-med);
  text-align: center;
  /* text-transform: uppercase; */
  color: var(--space-gray);
  background-color: var(--space-orange);
}

.profile-investments {
  display: flex;
  flex-wrap: wrap;
}

.profile-investment {
  width: calc(100% / 3);
  padding: 0.5rem 0.25rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: var(--space-white-opaque-1);
}

.profile-investment img {
  height: 1.5rem;
  width: 1.5rem;
  margin: 0 0.5rem;
}

.profile-investment p {
  margin: 0 0.5rem;
  font-size: var(--font-small);
  color: var(--space-white);
}

@media (max-width: 1366px) {
  .profile-info-player {
    font-size: var(--font-med);
  }
  .profile-frame {
    height: 4rem;
    width: 4rem;
  }
  .profile-investment img {
    height: 1.25rem;
    width: 1.25rem;
  }
}
</style>
