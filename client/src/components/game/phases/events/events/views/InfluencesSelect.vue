<template>
  <b-container fluid class="h-100 m-0 p-0">
    <b-row align-v="stretch" align-h="center" class="h-75 my-5">
      <!--
      ----------------------------------------------
         Event instructions | # of timeblocks left
      ----------------------------------------------
              Investment cards that represent
              available resources in player's
              inventory
      ----------------------------------------------
      -->

      <b-col v-if="investments.length > 0" cols="auto">
        <h5 v-if="remainingTimeBlocks > 0">Save up to {{ totalAvailableTimeBlocks }} Influence Resources from your current inventory.</h5>
        <h5 v-else>You have saved {{ totalAvailableTimeBlocks }} Influence Resource.</h5>
      </b-col>
      <div class="w-100"></div>
      <b-col cols="auto" v-if="investments.length > 0">
        <!-- 0 units saved -->
        <b-icon-bag v-if="remainingTimeBlocks == 2" scale="2"></b-icon-bag>
        <!-- 1 unit saved -->
        <b-icon-bag-plus v-else-if="remainingTimeBlocks == 1" scale="2"></b-icon-bag-plus>
        <!-- 2 units saved -->
        <b-icon-bag-check-fill v-else-if="remainingTimeBlocks == 0" scale="2"></b-icon-bag-check-fill>
      </b-col>
      <b-col cols="auto" v-if="investments.length > 0">
        <h5>{{ remainingTimeBlocks }} / {{ totalAvailableTimeBlocks }}</h5>
      </b-col>

      <!-- a row to display an icon for each unit a player is going to save -->
      <!-- <b-row>
        <b-img
          v-for="resource in toBeSaved"
          :key="resource.name"
          :src="require(`@port-of-mars/client/assets/icons/${resource.name}.svg`)"
          v-bind="icon"
        ></b-img>
      </b-row> -->

      <div class="w-100"></div>

      <b-row class="w-100" align-h="around" v-if="investments.length > 0">
        <InvestmentCard
          v-for="investment in investments"
          :key="investment.name"
          v-bind="investment"
          @update="setInvestmentAmount"
          :breakdownOfTrust="true"
          :remainingTimeBlocks="remainingTimeBlocks"
        >
        </InvestmentCard>
      </b-row>
      <b-col v-else class="text-center">
        <b-alert show variant="secondary" class="text-center">
          <h5>
            Because you have nothing in your inventory, Ready to Advance was automatically set.
          </h5>
        </b-alert>
      </b-col>
      <div class="w-100"></div>
      <button @click="submitSelection">Done</button>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Inject, Vue, Watch } from "vue-property-decorator";
import { Resource, ResourceAmountData, RESOURCES } from "@port-of-mars/shared/types";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import InvestmentCard from "@port-of-mars/client/components/game/phases/investment/InvestmentCard.vue";
import * as _ from "lodash";
import TimeBlockMeter from "@port-of-mars/client/components/game/phases/investment/TimeBlockMeter.vue";


/**
 * This component handles the Breakdown of Trust event that 
 * forces each player to select up to 2 of any influence resources that
 * they already possess.
 * 
 * Their choices are stored in the player's pendingInventory state and 
 * should not be applied to their actual inventory until the event
 * has completely finalized, otherwise they couldn't go back and cancel 
 * their readiness and redo their selection. 
 */
@Component({
  components: {
    TimeBlockMeter,
    InvestmentCard
  }
})
export default class InfluencesSelect extends Vue {
  @Inject() readonly api!: GameRequestAPI;
  icon = {
    center: true,
    fluid: true,
    blankColor: "#bbb",
    width: 200,
    height: 200
  };

  mounted() {
    if (this.investments.length < 1) {
      this.api.setPlayerReadiness(true);
    }
  }

  updated() {
    if (this.remainingTimeBlocks < 1) {
      this.submitSelection();
    }
  }

  get investments(): any {
    return RESOURCES.filter(resource => this.currentInventory[resource] !== 0).map(resource => {
      return {
        name: resource,
        cost: 1,
        pendingInvestment: this.pendingInvestments[resource]
      };
    });
  }

  get maxInfluencesToSave(): number {
    return _.sum(Object.values(this.currentInventory));
  }

  get currentInventory(): ResourceAmountData {
    return this.$tstore.getters.player.inventory;
  }

  get pendingInvestments(): ResourceAmountData {
    return this.$tstore.getters.player.pendingInvestments;
  }

  get remainingTimeBlocks() {
    return this.getRemainingTimeBlocks(this.pendingInvestments);
  }

  get totalAvailableTimeBlocks() {
    const tb = Math.min(this.maxInfluencesToSave, this.$tstore.getters.player.timeBlocks);
    return tb;
  }

  /* FIXME: needs to be carefully wired into this component. If
  we apply the pending inventory to the actual inventory too soon they can't 
  go back and change their investments when they cancel their readiness.
  */
  submitSelection() {
    this.api.saveBreakdownOfTrust(this.pendingInvestments);
    this.api.setPlayerReadiness(true);
  }

  getRemainingTimeBlocks(pendingInvestment: ResourceAmountData) {
    return this.totalAvailableTimeBlocks - _.sum(Object.values(pendingInvestment));
  }

  setInvestmentAmount(data: { name: Resource; units: number; cost: number }) {
    const pendingInventory = _.cloneDeep(this.pendingInvestments);
    pendingInventory[data.name] = data.units;
    const canAfford =
      data.units >= 0 &&
      data.units <= this.currentInventory[data.name] &&
      this.getRemainingTimeBlocks(pendingInventory) >= 0;

    if (canAfford) {
      this.api.investPendingTimeBlocks({
        investment: data.name,
        units: data.units,
        role: this.$tstore.state.role
      });
    }
  }
}
</script>
