<template>
  <b-container class="m-2" style="width: 30%; background-color: var(--dark-shade)">
    <b-row class="text-center">
      <b-col cols="12" style="background-color: var(--light-shade)">
        <p class="text-capitalize my-2" style="color: var(--dark-shade)">{{ label }}</p>
      </b-col>
      <b-col cols="12">
        <b-img
          rounded="circle"
          v-bind="mainProps"
          :src="require(`@port-of-mars/client/assets/icons/${name}.svg`)"
          :alt="name"
          class="m-2"
        >
        </b-img>
      </b-col>
      <b-col cols="12">
        <b-form-spinbutton
          v-model="pendingInvestment"
          :disabled="cannotInvest"
          min="0"
          :max="cost > remainingTimeBlocks ? pendingInvestment : 10"
          inline
        >
          <template #decrement>
            <b-button
              variant="transparent"
              :disabled="pendingUnits < 1"
              @click="setInvestmentAmount(pendingInvestment)"
            >
              <b-icon-dash scale="1.25" color="white"></b-icon-dash>
            </b-button>
          </template>
          <template #increment>
            <b-button
              variant="transparent"
              :disabled="cost > remainingTimeBlocks"
              @click="setInvestmentAmount(pendingInvestment)"
            >
              <b-icon-plus scale="1.25" color="white"></b-icon-plus>
            </b-button>
          </template>
        </b-form-spinbutton>
      </b-col>
      <b-col cols="6" class="text-left mt-3">
        <!-- pending units -->
        <b-icon-bag-plus scale="1.5"></b-icon-bag-plus>
        <span v-if="pendingUnits > 0" class="mx-2" style="color: green">+ {{ pendingUnits }}</span>
      </b-col>
      <b-col cols="6" class="text-right mt-3">
        <!-- cost -->
        <font-awesome-icon :icon="['fas', 'clock']" size="lg"></font-awesome-icon>
        <span class="mx-2">{{ cannotAfford ? "-" : cost }}</span>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons/faBriefcase";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { Resource } from "@port-of-mars/shared/types";
import { COST_INAFFORDABLE } from "@port-of-mars/shared/settings";

library.add(faClock);
library.add(faBriefcase);
Vue.component("font-awesome-icon", FontAwesomeIcon);

@Component({})
export default class InvestmentCard extends Vue {
  @Prop() name!: Resource;
  @Prop() cost!: number;
  @Prop() pendingInvestment!: number;
  @Prop() remainingTimeBlocks!: number;

  mainProps = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 50,
    height: 50
  };

  get cannotInvest(): boolean {
    return COST_INAFFORDABLE == this.cost || this.playerReady;
  }

  get cannotAfford(): boolean {
    return this.cost >= COST_INAFFORDABLE;
  }

  get pendingUnits() {
    return this.$tstore.getters.player.pendingInvestments[this.name];
  }

  get label() {
    return this.name == ("systemHealth" as any) ? "System Health" : this.name;
  }

  get playerReady() {
    return this.$tstore.getters.player.ready;
  }

  setInvestmentAmount(pendingInvestment: number): void {
    this.$emit("input", {
      name: this.name,
      units: this.pendingInvestment = pendingInvestment,
      cost: this.cost
    });
  }
}
</script>
