<template>
  <b-container no-gutters fluid class="h-100">
    <b-row align-v="stretch" align-h="center" class="h-100 w-100 text-center">
      <b-col
        v-for="(value, resource) in validResources"
        :key="resource"
        class="m-1 px-2 light-shade-05-border backdrop"
        style="border: 0.2rem solid var(--light-shade-25)"
        cols="3"
      >
        <b-col class="w-100 m-0 p-0" style="color: var(--dark-shade)">
          <p class="text-capitalize my-2" style="background-color: var(--light-shade)">
            {{ resource }}
          </p>
        </b-col>

        <b-row class="pb-2 pr-2">
          <b-img
            v-bind="mainProps"
            rounded="circle"
            :src="require(`@port-of-mars/client/assets/icons/${resource}.svg`)"
            :alt="resource"
            class="m-3"
          >
          </b-img
          ><b-form-spinbutton
            v-model="resources[resource]"
            v-if="mode === 'outgoing'"
            vertical
            size="sm"
            min="0"
            :max="playerInventory[resource]"
            :disabled="playerInventory[resource] === 0 || !hasSelectedPlayer"
            @change="resourceReader(resources)"
            class="mr-2"
          >
            <template #decrement>
              <b-icon-dash scale="1.00" color="white"></b-icon-dash>
            </template>
            <template #increment>
              <b-icon-plus scale="1.00" color="white"></b-icon-plus>
            </template>
          </b-form-spinbutton>
          <b-form-spinbutton
            v-else
            v-model="resources[resource]"
            vertical
            size="sm"
            :disabled="!hasSelectedPlayer"
            min="0"
            max="999"
            @change="resourceReader(resources)"
            class="mr-2"
          >
            <template #decrement>
              <b-icon-dash scale="1.00" color="white"></b-icon-dash>
            </template>
            <template #increment>
              <b-icon-plus scale="1.00" color="white"></b-icon-plus>
            </template>
          </b-form-spinbutton>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ResourceAmountData } from "@port-of-mars/shared/types";

@Component({})
export default class TradeOptions extends Vue {
  // the text that displays what type of option set it is
  @Prop({ default: "" }) text!: string;

  // mode -> 'incoming' | 'outgoing'
  @Prop({ default: "" }) mode!: string;

  // the way the parent gets the updates from the child
  @Prop() resourceReader!: any;

  //the starting values inherited from the parent
  @Prop() resources!: ResourceAmountData;

  mainProps = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 50,
    height: 50
  };

  get validResources() {
    if (this.mode === "outgoing") {
      return Object.keys(this.resources)
        .filter((resource) => this.playerInventory[resource] > 0)
        .reduce((obj, key) => {
          return Object.assign(obj, { [key]: this.resources[key] });
        }, {} as ResourceAmountData);
    } else {
      return this.resources;
    }
  }

  get selectedPlayer() {
    return this.$tstore.state.ui.tradeData.recipient.role;
  }

  get playerInventory() {
    return this.$store.getters.player.inventory;
  }

  hasSelectedPlayer() {
    console.log("selectedPLayer: ", this.selectedPlayer);
    return this.selectedPlayer != "";
  }
}
</script>
<style lang="scss" scoped>
.b-form-spinbutton.disabled,
.b-form-spinbutton.readonly {
  background-color: $dark-shade-75;
}
</style>

