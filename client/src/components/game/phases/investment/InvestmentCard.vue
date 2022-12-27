<template>
  <b-container
    style="width: 30%; background-color: var(--dark-shade); border: 0.2rem solid var(--light-shade-25)"
  >
    <b-row align-h="center" class="h-100">
      <b-col align-self="start" style="color: var(--dark-shade)">
        <p
          class="text-capitalize text-center my-2 p-1"
          style="background-color: var(--light-shade)"
        >
          {{ label }}
        </p>
      </b-col>
      <!-- create equal-width cols that span multiple lines by inserting <div class="w-100" /> to break new line after
           a col https://bootstrap-vue.org/docs/components/layout#columns-b-col -->
      <div class="w-100"></div>
      <b-col align-self="center">
        <b-img
          right
          v-bind="icon"
          :src="require(`@port-of-mars/client/assets/icons/${name}.svg`)"
          :alt="name"
        >
        </b-img>
      </b-col>
      <b-col align-self="center">
        <!-- FIXME:  adjustment for large screens?  offset-lg="3" lg="6" -->
        <!-- <b-col style="background-color:blue"> -->
        <b-form-spinbutton
          v-model="units"
          @input="setInvestmentAmount(units)"
          :readonly="playerReady || cannotPurchase || isCompulsivePhilanthropist"
          min="0"
          :max="maxInfluenceInvestment"
          vertical
        >
          <template #decrement>
            <b-icon-dash scale="1.25" color="white"></b-icon-dash>
          </template>
          <template #increment>
            <b-icon-plus scale="1.25" color="white"></b-icon-plus>
          </template>
        </b-form-spinbutton>
      </b-col>
      <div class="w-100"></div>
      <b-col v-if="!cannotPurchase" align-self="end" class="text-left mx-1 p-1">
        <!-- cost -->
        <font-awesome-icon :icon="['fas', 'clock']" size="lg"></font-awesome-icon>
        <span class="mx-2">{{ cost }}</span>
      </b-col>
      <b-col v-else align-self="end" class="text-left mx-1 p-1">
        <b-badge variant="warning">Cannot Invest</b-badge>
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
import { Investment, Resource } from "@port-of-mars/shared/types";
import { Constants } from "@port-of-mars/shared/settings";

library.add(faClock);
library.add(faBriefcase);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({})
export default class InvestmentCard extends Vue {
  @Prop()
  name!: Investment;

  @Prop()
  cost!: number;

  @Prop()
  remainingTimeBlocks!: number;

  // prop to signify that this card is part of a Breakdown of Trust event
  @Prop({ default: false })
  breakdownOfTrust!: boolean;

  icon = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 75,
    height: 75
  };
  units: number = 0;

  created() {
    // we could instead sync pendingInvestments from the server instead of resetting
    // them client-side, but since the server forces the correct investment, this
    // is purely visual
    if (this.isCompulsivePhilanthropist && this.name === "systemHealth") {
      this.units = this.maxTimeBlocks;
      this.setInvestmentAmount(this.units);
    }
  }

  get isCompulsivePhilanthropist(): boolean {
    return this.$tstore.getters.player.isCompulsivePhilanthropist;
  }

  /**
   * Define if investment is affordable.
   */
  get cannotPurchase(): boolean {
    return this.cost >= Constants.MAXIMUM_COST;
  }

  /**
   * Units that will be invested when the invest phase ends.
   */
  get pendingUnits() {
    return this.$tstore.getters.player.pendingInvestments[this.name];
  }

  get maxInfluenceInvestment() {
    if (this.breakdownOfTrust) {
      // in a breakdown of trust event show existing influence resources
      // to let the player select 2 Influence resources to preserve
      const influenceResourceName = this.name as Resource
      const influence = this.$tstore.getters.player.inventory[influenceResourceName];
      return Math.min(this.remainingTimeBlocks, influence);
    }
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
