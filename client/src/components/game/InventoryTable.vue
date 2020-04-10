<template>
  <table class="table">
    <thead>
      <tr>
        <th v-for="header in headers" :key="header" class="header">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="data" v-for="resource in resourceNames" :key="resource">
        <td class="resource-name-data">
          <img
            class="icon"
            :src="require(`@port-of-mars/client/assets/icons/${resource}.svg`)"
            :alt="resource"
          />
          {{ resource }}
        </td>
        <td class="resource-costs-data">
          {{ resourceCosts(resource) }}
        </td>
        <td class="resource-amounts-data">
          {{ resourceAmounts(resource) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Resource } from '@port-of-mars/shared/types';

@Component({
  components: {},
})
export default class InventoryTable extends Vue {
  @Prop() playerData!: any;
  @Prop() isVisible!: boolean;

  get headers() {
    return ['Resource', 'Cost', `Inventory`];
  }

  get resourceNames() {
    return Object.keys(this.playerData.info.inventory);
  }

  resourceCosts(resource: Resource) {
    return this.isVisible
      ? this.playerData.info.costs[resource] > 1001
        ? 'X'
        : this.playerData.info.costs[resource]
      : '??';
  }

  resourceAmounts(resource: Resource) {
    return this.isVisible ? this.playerData.info.inventory[resource] : '??';
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/InventoryTable.scss';
</style>
