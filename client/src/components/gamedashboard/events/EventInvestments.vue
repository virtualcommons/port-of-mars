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
          :src="require(`@/assets/iconsSVG/${investment.name}.svg`)"
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
          :src="require(`@/assets/iconsSVG/${selectedInvestment.name}.svg`)"
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
          :src="require(`@/assets/iconsSVG/${influence}.svg`)"
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
          :src="require(`@/assets/iconsSVG/${drawnInfluence}.svg`)"
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

<style scoped>
/* SELECT_INFLUENCES */

.event-select-influences {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.event-select-influences-select {
  display: flex;
}

.event-select-influences-select-influence {
  margin: 0 1rem;
}

.event-select-influences-select-influence img {
  height: 4rem;
  width: 4rem;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.event-select-influences-select-influence img:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.event-select-influences-select-influence p {
  margin-bottom: 0;
  text-align: center;
}

.event-select-influences-selected {
  display: flex;
  justify-content: center;
}

.event-select-influences-selected-influence {
  margin: 0 1rem;
  display: flex;
}

.event-select-influences-selected-influence img {
  height: 4rem;
  width: 4rem;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.event-select-influences-selected-influence img:hover {
  opacity: 0.5;
  cursor: pointer;
  transform: scale(1.1);
}

.event-select-influences p {
  margin: 2rem 0;
}

.selected-placeholder {
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--space-white-opaque-2);
}

.event-select-influences button {
  height: 3rem;
  width: 12rem;
  border: 0.125rem solid var(--space-orange);
  border-radius: 0.75rem;
  margin-top: 2rem;
  color: var(--space-white);
  background-color: transparent;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.event-select-influences button:hover {
  color: var(--space-gray);
  background-color: var(--space-orange);
  transform: scale(1.1);
}

.event-select-influences button:focus,
.event-select-influences button:active {
  outline: none;
}
</style>
