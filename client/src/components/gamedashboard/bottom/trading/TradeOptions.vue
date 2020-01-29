<template>
  <div class="trade-resources">
    <p class="type-text">{{ text }}</p>
    <div class="resource-wrapper">
      <div class="send-investments" v-for="(value, resource) in resources" :key="resource + 1"
        v-bind:class="{'impossible-resource': grayOutResources(resource)}"
      >
        <div>
          <img
            class="resource-icon"
            :src="require(`@/assets/icons/${resource}.svg`)"
            alt="Investment"
          />
        </div>

        <div
        v-bind:class="{'impossible-resource': impossibleTrade(resource)}"
        >
          <input v-if="mode=='outgoing'" :disabled="playerInventory[resource]==0" type="number" min="0" :max="playerInventory[resource]" @change='resourcesAmount()' v-model.number="resources[resource]" class="resource-amount"/>
          <input v-else type="number" min="0" max="999" v-on:change='resourcesAmount()' v-model.number="resources[resource]" class="resource-amount"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import * as _ from 'lodash';
import {Resource, ResourceAmountData} from 'shared/types';
import { makeTradeSafe } from 'shared/validation';
@Component({})
export default class TradeOptions extends Vue {
  @Prop({ default: '' }) text!: string;
  @Prop({default: ''}) mode!:string;
  @Prop() resourceReader!: any;

  private resources: ResourceAmountData = {
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0
  };

  resourcesAmount() {

    makeTradeSafe(this.resources)

    this.resourceReader(this.resources);
    return;
  }

  get playerInventory(){
    return this.$store.getters.player.inventory;
  }

  impossibleTrade(resource: Resource){
    if(this.resources[resource] > this.playerInventory[resource] && this.mode=="outgoing"){
      return true;
    }
    return false;
  }


  grayOutResources(resource: Resource){
    if(this.playerInventory[resource] == 0 && this.mode=="outgoing"){
      return true;
    }
    return false;
  }

}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/trading/TradeOptions.scss';
</style>
