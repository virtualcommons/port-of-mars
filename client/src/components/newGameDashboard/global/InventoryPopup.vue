<template>
  <div class="c-inventorypopup" :style="position">
    <BButton @click="toggle" class="toggle">
      <span>Inventory</span>
      <font-awesome-icon
        v-if="!visible"
        :icon="['fas', 'caret-up']"
        size="lg"
      />
      <font-awesome-icon
        v-if="visible"
        :icon="['fas', 'caret-down']"
        size="lg"
      />
    </BButton>
    <div class="wrapper">
      <div
        v-for="investment in investments"
        :key="investment.name"
        :style="backgroundColor(investment.name)"
        class="investment"
      >
        <div class="left">
          <img
            :src="
              require(`@port-of-mars/client/assets/icons/${investment.name}.svg`)
            "
            alt="Investment"
          />
          <p>{{ investment.name }}</p>
        </div>
        <div class="right">
          <p class="units">{{ investment.units }}</p>
        </div>
      </div>
      <div :style="backgroundColor('upkeep')" class="investment">
        <div class="left">
          <img
            :src="require(`@port-of-mars/client/assets/icons/upkeep.svg`)"
            alt="Investment"
          />
          <p>{{ contributedSystemHealth.name }}</p>
        </div>
        <div class="right">
          <p class="units">{{ contributedSystemHealth.units }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { BButton } from 'bootstrap-vue';
import {
  Investment,
  Resource,
  RESOURCES,
  Phase
} from '@port-of-mars/shared/types';

library.add(faCaretUp);
library.add(faCaretDown);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {
    BButton
  }
})
export default class InventoryPopup extends Vue {
  private visible: boolean = false;

  private toggle() {
    this.visible = !this.visible;
  }

  get position() {
    return this.visible ? { bottom: '0rem' } : { bottom: '-45rem' };
  }

  get investments() {
    const p = this.$tstore.getters.player;
    const inventory = p.inventory;
    const pendingInventory = p.pendingInvestments;
    const costs = p.costs;
    return RESOURCES.map(name => ({
      name,
      units: inventory[name as Resource],
      pendingUnits: pendingInventory[name as Resource],
      cost: costs[name as Resource]
    }));
  }

  get contributedSystemHealth() {
    const p = this.$tstore.getters.player;
    const pendingInvestment = p.pendingInvestments;
    const costs = p.costs;
    return {
      name: 'System Health',
      units: p.contributedUpkeep,
      pendingUnits: pendingInvestment.upkeep,
      cost: costs.upkeep
    };
  }

  // 'culture',
  // 'finance',
  // 'government',
  // 'legacy',
  // 'science',
  // 'upkeep'

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
        color = 'var(--space-white-opaque-1)';
    }
    return { backgroundColor: color };
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/global/InventoryPopup.scss';
</style>
