<template>
  <b-container
    class="m-2"
    style="width: 30%; background-color: var(--dark-shade); border: 0.2rem solid var(--light-shade-25)"
  >
    <b-row align-v="stretch" class="h-100 text-center">
      <b-col style="color: var(--dark-shade)">
        <p class="text-capitalize p-2 my-2" style="background-color: var(--light-shade)">
          {{ label }}
        </p>
      </b-col>
      <!-- create equal-width cols that span multiple lines by inserting <div class="w-100" /> to break new line after
           a col https://bootstrap-vue.org/docs/components/layout#columns-b-col -->
      <div class="w-100"></div>
      <b-col>
        <b-img
          center
          rounded="circle"
          v-bind="mainProps"
          :src="require(`@port-of-mars/client/assets/icons/${name}.svg`)"
          :alt="name"
        >
        </b-img>
      </b-col>
      <div class="w-100"></div>
      <b-col>
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
              <b-icon-dash scale="1.5" color="white"></b-icon-dash>
            </b-button>
          </template>
          <template #increment>
            <b-button
              variant="transparent"
              :disabled="cost > remainingTimeBlocks"
              @click="setInvestmentAmount(pendingInvestment)"
            >
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
