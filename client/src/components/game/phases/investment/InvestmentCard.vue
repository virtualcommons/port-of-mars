<template>
  <b-container
    class="m-2"
    style="width: 30%; background-color: var(--dark-shade); border: 0.2rem solid var(--light-shade-25)"
  >
    <b-row align-v="stretch" class="h-100 text-center">
      <b-col style="color: var(--dark-shade)">
        <p class="text-capitalize my-2" style="background-color: var(--light-shade)">
          {{ label }}
        </p>
      </b-col>
      <!-- create equal-width cols that span multiple lines by inserting <div class="w-100" /> to break new line after
           a col https://bootstrap-vue.org/docs/components/layout#columns-b-col -->
      <div class="w-100"></div>
      <b-col>
        <b-img
          center
          class="p-1"
          rounded="circle"
          v-bind="icon"
          :src="require(`@port-of-mars/client/assets/icons/${name}.svg`)"
          :alt="name"
        >
        </b-img>
      </b-col>
      <div class="w-100"></div>
      <b-col>
        <b-form-spinbutton
          v-model="units"
          @input="setInvestmentAmount(units)"
          :readonly="playerReady"
          min="0"
          :max="maxInfluenceInvestment"
          inline
        >
          <template #decrement>
            <b-button variant="transparent">
              <b-icon-dash scale="1.5" color="white"></b-icon-dash>
            </b-button>
          </template>
          <template #increment>
            <b-button variant="transparent">
              <b-icon-plus scale="1.5" color="white"></b-icon-plus>
            </b-button>
          </template>
        </b-form-spinbutton>
      </b-col>
      <div class="w-100"></div>
      <b-col align-self="end" cols="auto" class="mr-auto mb-2">
        <!-- pending units -->
        <b-icon-bag-plus scale="1.5"></b-icon-bag-plus>
        <span v-if="pendingUnits > 0" class="mx-2" style="color: green">+ {{ pendingUnits }}</span>
      </b-col>
      <b-col align-self="end" cols="auto" class="mb-2">
        <!-- cost -->
        <font-awesome-icon :icon="['fas', 'clock']" size="lg"></font-awesome-icon>
        <span class="mx-2">{{ cannotAfford ? "-" : cost }}</span>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue } from "vue-property-decorator";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons/faBriefcase";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { Resource } from "@port-of-mars/shared/types";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import { COST_INAFFORDABLE } from "@port-of-mars/shared/settings";

library.add(faClock);
library.add(faBriefcase);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({})
export default class InvestmentCard extends Vue {
  @Prop() name!: Resource;
  @Prop() cost!: number;
  @Prop() remainingTimeBlocks!: number;

  // prop to signify that this card is part of a Breakdown of Trust event
  @Prop({ default: false }) breakdownOfTrust!: boolean;

  @Inject() readonly api!: GameRequestAPI;

  icon = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 50,
    height: 50
  };
  units: number = 0;

  /**
   * Define if investment is affordable.
   */
  get cannotAfford(): boolean {
    return this.cost >= COST_INAFFORDABLE;
  }

  /**
   * Units that will be invested when the invest phase ends.
   */
  get pendingUnits() {
    return this.$tstore.getters.player.pendingInvestments[this.name];
  }

  get currentInfluence() {
    const influence = this.$tstore.getters.player.inventory[this.name];
    return influence;
  }

  get maxInfluenceInvestment() {
    if (this.breakdownOfTrust) {
      return Math.min(this.remainingTimeBlocks, this.currentInfluence);
    }
    // FIXME: 10 should be pulled from somewhere else, max time blocks in the store?
    return this.cost > this.remainingTimeBlocks ? this.units : this.maxTimeBlocks;
  }

  get maxTimeBlocks() {
    return this.$tstore.getters.player.timeBlocks;
  }

  /**
   * Formatted system health label
   */
  get label() {
    return this.name == ("systemHealth" as any) ? "System Health" : this.name;
  }

  /**
   * Player readiness status.
   */
  get playerReady() {
    return this.$tstore.getters.player.ready;
  }

  /**
   * Purchase
   */
  setInvestmentAmount(units: number): void {
    this.$emit("update", {
      name: this.name,
      units: units,
      cost: this.cost
    });
  }
}
</script>

<style scoped lang="scss">
.b-form-spinbutton.disabled,
.b-form-spinbutton.readonly {
  background-color: $dark-shade-75;
}
</style>
