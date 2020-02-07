<template>
  <div class="trade-options">
    <p class="type-text">{{ text }}</p>
    <div class="wrapper">
      <div
        class="investments"
        v-for="(value, resource) in resources"
        :key="resource + 1"
        v-bind:class="{ 'impossible-resource': grayOutResources(resource) }"
      >
        <div>
          <img
            class="icon"
            :src="require(`@/assets/icons/${resource}.svg`)"
            alt="Investment"
          />
        </div>

        <div class="input-wrapper">
          <div
            v-bind:class="{ 'impossible-resource': impossibleTrade(resource) }"
          >
            <input
              v-if="mode == 'outgoing'"
              :disabled="playerInventory[resource] == 0"
              type="number"
              v-model.number="resources[resource]"
              class="outgoing-amount"
            />
            <input
              v-else
              type="number"
              v-model.number="resources[resource]"
              class="incoming-amount"
            />
          </div>
          <div class="button-container">
            <button
              @click="increaseNum(resource)"
              :disabled="mode == 'outgoing' && playerInventory[resource] == 0"
              type="button"
              name="button"
            >
              +
            </button>
            <button
              @click="decreaseNum(resource)"
              :disabled="mode == 'outgoing' && playerInventory[resource] == 0"
              type="button"
              name="button"
            >
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import * as _ from 'lodash';
import { Resource, ResourceAmountData } from 'shared/types';
import { makeTradeSafe } from 'shared/validation';
@Component({})
export default class TradeOptions extends Vue {
  @Prop({ default: '' }) text!: string;
  @Prop({ default: '' }) mode!: string;
  @Prop() resourceReader!: any;

  private resources: ResourceAmountData = {
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0
  };

  // resourcesAmount() {
  //   makeTradeSafe(this.resources);
  //
  //   this.resourceReader(this.resources);
  //   return;
  // }

  get playerInventory() {
    return this.$store.getters.player.inventory;
  }

  impossibleTrade(resource: Resource) {
    if (
      this.resources[resource] > this.playerInventory[resource] &&
      this.mode == 'outgoing'
    ) {
      return true;
    }
    return false;
  }

  grayOutResources(resource: Resource) {
    if (this.playerInventory[resource] == 0 && this.mode == 'outgoing') {
      return true;
    }
    return false;
  }

  private increaseNum(resource: Resource): void {
    let max: number;

    if (this.mode === 'outgoing') {
      max = this.playerInventory[resource];
    } else {
      max = 999;
    }

    if (this.resources[resource] < max) {
      this.resources[resource]++;
    } else {
      this.resources[resource] = max;
    }

    makeTradeSafe(this.resources);
    this.resourceReader(this.resources);
  }

  private decreaseNum(resource: Resource): void {
    const min: number = 0;

    if (this.resources[resource] > min) {
      this.resources[resource]--;
    } else {
      this.resources[resource] = min;
    }

    makeTradeSafe(this.resources);
    this.resourceReader(this.resources);
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/trading/TradeOptions.scss';
</style>
