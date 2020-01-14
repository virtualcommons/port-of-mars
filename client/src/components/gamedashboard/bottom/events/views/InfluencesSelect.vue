<template>
  <div class="event-select-influences">
    <p>Please select up to two available influences:</p>

    <div class="event-select-influences-select">
      <div
        class="event-select-influences-select-influence"
        v-if="investment.units > 0"
        v-for="investment in investments"
        :key="investment.name"
      >
        <img
          @click="handleSelectInfluence(investment.name)"
          :src="require(`@/assets/icons/${investment.name}.svg`)"
          alt="Investment"
        />
        <!-- <p>{{ investment.units }}</p> -->
      </div>
    </div>

    <p>Chosen</p>

    <div v-if="selectedInvestmentsDataCount === 0" class="selected-placeholder">
      <p>None Selected</p>
    </div>

    <div class="event-select-influences-selected">
      <div
        class="event-select-influences-selected-influence"
        v-if="selectedInvestment.units > 0"
        v-for="selectedInvestment in selectedInvestments"
        :key="selectedInvestment.name"
      >
        <img
          v-for="unit in selectedInvestment.units"
          @click="handleDeselectInfluences(selectedInvestment.name)"
          :src="require(`@/assets/icons/${selectedInvestment.name}.svg`)"
          alt="Investment"
        />
      </div>
    </div>

    <button type="button" name="button" @click="submitSelectedInfluences">Done</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import {Resource, ResourceAmountData} from "shared/types";

@Component({})
export default class InfluencesSelect extends Vue {
  private investmentsTest: ResourceAmountData = {
    science: 1,
    government: 2,
    legacy: 0,
    finance: 1,
    culture: 0
  };

  get investments(): any {
    // ACTUAL IMPLEMENTATION
    // const inventory = this.$tstore.getters.player.inventory;
    // return Object.keys(inventory).map(name => ({
    //   name,
    //   units: inventory[name as Resource]
    // }));

    // TEST IMPLEMENTATION
    return Object.keys(this.investmentsTest).map(name => ({
      name,
      units: this.investmentsTest[name as Resource]
    }));
  }

  private selectedInvestmentsData: ResourceAmountData = {
    science: 0,
    government: 0,
    legacy: 0,
    finance: 0,
    culture: 0
  };

  private selectedInvestmentsDataCount: number = 0;

  get selectedInvestments(): any {
    return Object.keys(this.selectedInvestmentsData).map(name => ({
      name,
      units: this.selectedInvestmentsData[name as Resource]
    }));
  }

  private handleSelectInfluence(investment: Resource): void {
    // ACTUAL IMPLEMENTATION
    // if (this.selectedInvestmentsDataCount < 2) {
    //   if (this.selectedInvestmentsData[investment] + 1 <= this.$tstore.getters.player.inventory[investment]) {
    //     this.selectedInvestmentsData[investment] += 1;
    //     this.selectedInvestmentsDataCount += 1;
    //   }
    // }

    // TEST IMPLEMENTATION
    if (this.selectedInvestmentsDataCount < 2) {
      if (this.selectedInvestmentsData[investment] + 1 <= this.investmentsTest[investment]) {
        this.selectedInvestmentsData[investment] += 1;
        this.selectedInvestmentsDataCount += 1;
      }
    }
  }

  private handleDeselectInfluences(investment: Resource): void {
    if (this.selectedInvestmentsData[investment] !== 0 && this.selectedInvestmentsDataCount !== 0) {
      this.selectedInvestmentsData[investment] -= 1;
      this.selectedInvestmentsDataCount -= 1;
    }
  }

  private submitSelectedInfluences(): void {
    console.log(this.selectedInvestmentsData);
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/events/views/InfluencesSelect.scss';
</style>
