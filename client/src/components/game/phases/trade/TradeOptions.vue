<template>
  <b-container fluid class="h-100">
    <b-row class="w-100 h-auto">
      <p>{{ text }}</p>
    </b-row>
    <b-row class="w-100">
      <div
        v-for="(value, resource) in resources"
        :key="resource"
        class="m-2"
      >
        <b-img
          v-bind="mainProps"
          rounded="circle"
          :src="require(`@port-of-mars/client/assets/icons/${resource}.svg`)"
          :alt="resource"
          class="m-3"
        >
        </b-img>
        <b-form-spinbutton
          v-model="resources[resource]"
          v-if="mode === 'outgoing'"
          min="0"
          max="999"
          :disabled="playerInventory[resource] === 0 || !hasSelectedPlayer"
          inline
          @change="resourceReader(resources)"
        ></b-form-spinbutton>
        <b-form-spinbutton
          v-else
          v-model="resources[resource]"
          :disabled="!hasSelectedPlayer"
          min="0"
          max="999"
          inline
          @change="resourceReader(resources)"
        ></b-form-spinbutton>
      </div>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ResourceAmountData } from '@port-of-mars/shared/types';

@Component({})
export default class TradeOptions extends Vue {
  // the text that displays what type of option set it is
  @Prop({ default: '' }) text!: string;

  // mode -> 'incoming' | 'outgoing'
  @Prop({ default: '' }) mode!: string;

  // the way the parent gets the updates from the child
  @Prop() resourceReader!: any;

  //the starting values inherited from the parent
  @Prop() resources!: ResourceAmountData;

  mainProps = {
    center: true,
    fluid: true,
    blankColor: '#bbb',
    width: 64,
    height: 64,
  }

  get selectedPlayer() {
    return this.$tstore.state.ui.tradeData.recipient.role;
  }

  get playerInventory() {
    return this.$store.getters.player.inventory;
  }

  hasSelectedPlayer() {
    console.log("selectedPLayer: ", this.selectedPlayer);
    return this.selectedPlayer != '';
  }
}
</script>
