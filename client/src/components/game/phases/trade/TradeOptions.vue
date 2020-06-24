<template>
  <div class="c-trade-options container">
    <div class="title-wrapper row">
      <div class="title col-12">
        <p>{{ text }}</p>
      </div>
    </div>
    <div class="investment-wrapper row">
      <div
        v-for="(value, resource) in resources"
        :key="resource + Math.random()"
        class="investment col"
      :class="{ 'unavailable-investment': grayOutResources(resource) }"
      >
        <div class="investment-input-wrapper">
          <!-- TODO: add tooltip -->
          <img
            :src="require(`@port-of-mars/client/assets/icons/${resource}.svg`)"
            alt="Investment"
          />
          <div class="input">
            <input
              v-if="mode === 'outgoing'"
              type="number"
              v-model.number="resources[resource]"
              :disabled="playerInventory[resource] === 0"
            />
            <input v-else type="number" v-model.number="resources[resource]" />
          </div>
        </div>
        <div class="buttons-wrapper">
          <button
            @click="decreaseNum(resource)"
            :disabled="mode === 'outgoing' && playerInventory[resource] === 0"
          >
            <font-awesome-icon
              :icon="['fas', 'minus']"
              size="sm"
              class="icon"
            />
          </button>
          <button
            @click="increaseNum(resource)"
            :disabled="mode === 'outgoing' && playerInventory[resource] === 0"
          >
            <font-awesome-icon :icon="['fas', 'plus']" size="sm" class="icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Resource, ResourceAmountData } from '@port-of-mars/shared/types';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';

library.add(faPlus);
library.add(faMinus);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({})
export default class TradeOptions extends Vue {
  //the text that displays what type of option set it is
  @Prop({ default: '' }) text!: string;

  //mode -> 'incoming' | 'outgoing'
  @Prop({ default: '' }) mode!: string;

  //the way the parent gets the updates from the child
  @Prop() resourceReader!: any;

  //the starting values inherited from the parent
  @Prop() resources!: ResourceAmountData;

  get playerInventory() {
    return this.$store.getters.player.inventory;
  }

  private grayOutResources(resource: Resource) {
    return this.playerInventory[resource] == 0 && this.mode == 'outgoing';

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

    this.resourceReader(this.resources);
  }

  private decreaseNum(resource: Resource): void {
    const min: number = 0;

    if (this.resources[resource] > min) {
      this.resources[resource]--;
    } else {
      this.resources[resource] = min;
    }
    this.resourceReader(this.resources);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/trade/TradeOptions.scss';
</style>
