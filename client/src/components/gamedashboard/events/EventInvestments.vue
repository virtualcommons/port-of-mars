<template>
  <!-- SELECT_INFLUENCES -->
  <div v-if="eventView === 'SELECT_INFLUENCES'" class="event-select-influences">
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

  <!-- DRAW_INFLUENCES -->

  <div v-else-if="eventView === 'DRAW_INFLUENCES'" class="event-select-influences">
    <p>Please select one influence:</p>
    <div class="event-select-influences-select">
      <div
        class="event-select-influences-select-influence"
        v-for="influence in availableInfluences"
        :key="influence"
      >
        <img
          @click="handleDrawInfluence(influence)"
          :src="require(`@/assets/icons/${influence}.svg`)"
          alt="Investment"
        />
        <!-- <p>{{ investment.units }}</p> -->
      </div>
    </div>
    <p>Chosen</p>
    <div v-if="drawnInfluence === 'None Selected'" class="selected-placeholder">
      <p>None Selected</p>
    </div>
    <div class="event-select-influences-selected" v-else-if="drawnInfluence !== 'None Selected'">
      <div class="event-select-influences-selected-influence">
        <img
          @click="handleUndrawInfluence"
          :src="require(`@/assets/icons/${drawnInfluence}.svg`)"
          alt="Investment"
        />
      </div>
    </div>
    <button type="button" name="button" @click="submitDrawnInfluence">Done</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ResourceAmountData, Resource, Role } from 'shared/types';

@Component({})
export default class EventInvestments extends Vue {
  @Prop({ default: '' }) private eventView!: string;
  // SELECT_INFLUENCES

  private investmentsTest: ResourceAmountData = {
    science: 1,
    government: 1,
    legacy: 0,
    finance: 1,
    culture: 0
  };

  get investments() {
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

  get selectedInvestments() {
    return Object.keys(this.selectedInvestmentsData).map(name => ({
      name,
      units: this.selectedInvestmentsData[name as Resource]
    }));
  }

  handleSelectInfluence(investment: string): void {
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

  handleDeselectInfluences(investment: string): void {
    if (this.selectedInvestmentsData[investment] !== 0 && this.selectedInvestmentsDataCount !== 0) {
      this.selectedInvestmentsData[investment] -= 1;
      this.selectedInvestmentsDataCount -= 1;
    }
  }

  submitSelectedInfluences() {
    console.log(this.selectedInvestmentsData);
  }

  // DRAW_INFLUENCES

  private drawnInfluence = 'None Selected';

  get availableInfluences() {
    return ['science', 'government', 'legacy', 'finance', 'culture'];
  }

  handleDrawInfluence(influence) {
    this.drawnInfluence = influence;
    console.log('DRAW: ', influence);
  }

  handleUndrawInfluence() {
    this.drawnInfluence = 'None Selected';
  }

  submitDrawnInfluence() {
    console.log('SUBMIT DRAWN INFLUENCE: ', this.drawnInfluence);
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/events/EventInvestments.scss';
</style>
