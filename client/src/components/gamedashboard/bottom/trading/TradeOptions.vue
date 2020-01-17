<template>
  <div class="trade-resources">
    <p class="type-text">{{ text }}</p>
    <div class="send-investments" v-for="(value, resource) in resources" :key="resource + 1">
      <div>
        <img
          class="resource-icon"
          :src="require(`@/assets/icons/${resource}.svg`)"
          alt="Investment"
        />
      </div>
      <div>
        <input v-if="mode=='outgoing'" type="number" min="0" :max="playerInventory[resource]" @change='resourcesAmount' v-model.number="resources[resource]" class="resource-amount" />
        <input v-else type="number" min="0" max="999" v-on:change='resourcesAmount()' v-model.number="resources[resource]" class="resource-amount" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import * as _ from 'lodash';
import { ResourceAmountData } from 'shared/types';
@Component({})
export default class TradeOptions extends Vue {
  @Prop({ default: '' }) text!: string;
  @Prop() resourceReader!: any;

  private resources: ResourceAmountData = {
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0
  };

  get resourcesAmount() {
    this.resourceReader(this.resources);
    return;
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/trading/TradeOptions.scss';
</style>
