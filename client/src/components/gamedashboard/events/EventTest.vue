<!-- NO_CHANGE = 'NO_CHANGE' - VIEW DONE -->
<!-- YES_NO_VOTE = 'YES_NO_VOTE' - VIEW DONE -->
<!-- SELECT_INFLUENCES = 'SELECT_INFLUENCES' - VIEW DONE-->
<!-- DRAW_INFLUENCES = 'DRAW_INFLUENCES' -->
<!-- VOTE_FOR_PLAYER_SINGLE = 'VOTE_FOR_PLAYER_SINGLE' -->
<!-- VOTE_FOR_PLAYER_HERO_PARIAH = 'VOTE_FOR_PLAYER_HERO_PARIAH' -->
<!-- AUDIT = 'AUDIT' -->
<!-- SELECT_PURCHASED_ACCOMPLISHMENT = 'SELECT_PURCHASED_ACCOMPLISHMENT' -->
<!-- DISABLE_CHAT = 'DISABLE_CHAT' -->
<!-- EVENT_TEST = 'EVENT_TEST' -->

<template>
  <div class="event-test">
    <!-- NO_CHANGE -->
    <div v-if="layout === 'NO_CHANGE'" class="event-no-change">
      <p>Nothing to see here!</p>
    </div>

    <!-- YES_NO_VOTE -->
    <div v-if="layout === 'YES_NO_VOTE'" class="event-yes-no-vote">
      <p>Please select an option:</p>
      <div class="event-yes-no-vote-buttons">
        <button type="button" name="yes button" @click="handleYesNoVote(true)">Yes</button>
        <button type="button" name="no button" @click="handleYesNoVote(false)">No</button>
      </div>
    </div>

    <!-- SELECT_INFLUENCES -->
    <div v-if="layout === 'SELECT_INFLUENCES'" class="event-select-influences">
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

    <!-- VOTE_FOR_PLAYER_SINGLE -->
    <div v-if="layout === 'VOTE_FOR_PLAYER_SINGLE'" class="event-for-player-single">
      <div class="player-frame-container">
        <div
          v-for="member in members"
          class="player-frame"
          :style="member === selectedPlayer ? 'backgroundColor: var(--space-orange)' : ''"
        >
          <img
            @click="handleSelectPlayer(member)"
            :src="require(`@/assets/characters/${member}.png`)"
            alt="Player"
          />
        </div>
      </div>
      <p class="selected-player-title">Selected Player</p>
      <p
        :style="selectedPlayer === 'None Selected' ? 'color: var(--space-white-opaque-2)' : ''"
        class="selected-player-text"
      >
        {{ selectedPlayer }}
      </p>
      <button type="button" name="button" @click="submitSelectedPlayer">Done</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { ResourceAmountData, Resource, Role } from 'shared/types';

@Component({})
export default class EventTest extends Vue {
  // ALL
  get layout() {
    console.log(`(${typeof this.$tstore.state.eventView}): ${this.$tstore.state.eventView}`);
    return this.$tstore.state.eventView;
  }

  // YES_NO_VOTE
  handleYesNoVote(selection: boolean): void {
    console.log(selection);
  }

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

  // VOTE_FOR_PLAYER_SINGLE
  private selectedPlayer = 'None Selected';

  get members() {
    // if (this.$store.state.role !== '') {
    //   return ['Researcher', 'Pioneer', 'Curator', 'Entrepreneur', 'Politician'].filter(
    //     name => name !== this.$store.state.role
    //   );
    // }
    return ['Researcher', 'Pioneer', 'Curator', 'Entrepreneur', 'Politician'];
  }

  handleSelectPlayer(member: Role): void {
    this.selectedPlayer = member;
    console.log('MEMBER: ', this.selectedPlayer);
  }

  submitSelectedPlayer() {
    console.log('SUBMIT MEMBER: ', this.selectedPlayer);
  }
}
</script>

<style scoped>
/* EVENT CONTAINER */

.event-test {
  height: 100%;
  width: 100%;
}

/* NO_CHANGE */

.event-no-change {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--space-white);
}

.event-no-change p {
  margin: 0;
}

/* YES_NO_VOTE */

.event-yes-no-vote {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--space-white);
}

.event-yes-no-vote p {
  margin-bottom: 2rem;
}

.event-yes-no-vote-buttons {
  display: flex;
}

.event-yes-no-vote-buttons button {
  height: 4rem;
  width: 14.5rem;
  border: 0.125rem solid var(--space-orange);
  border-radius: 1rem;
  margin: 0 0.5rem;
  color: var(--space-white);
  background-color: transparent;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.event-yes-no-vote-buttons button:hover {
  color: var(--space-gray);
  background-color: var(--space-orange);
  transform: scale(1.1);
}

.event-yes-no-vote-buttons button:focus,
.event-yes-no-vote-buttons button:active {
  outline: none;
}

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
  height: 4rem;
  width: 14.5rem;
  border: 0.125rem solid var(--space-orange);
  border-radius: 1rem;
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

/* VOTE_FOR_PLAYER_SINGLE */
.event-for-player-single {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background-color: green; */
}

.event-for-player-single button {
  height: 4rem;
  width: 14.5rem;
  border: 0.125rem solid var(--space-orange);
  border-radius: 1rem;
  margin-top: 2rem;
  color: var(--space-white);
  background-color: transparent;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.event-for-player-single button:hover {
  color: var(--space-gray);
  background-color: var(--space-orange);
  transform: scale(1.1);
}

.event-for-player-single button:focus,
.event-for-player-single button:active {
  outline: none;
}

.player-frame-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.player-frame {
  height: 5rem;
  width: 5rem;
  padding: 0.25rem;
  border: 0.125rem solid var(--space-orange);
  border-radius: 50%;
  margin: 0 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.player-frame:hover {
  transform: scale(1.1);
  cursor: pointer;
}

.player-frame img {
  height: 100%;
}

.selected-player-title {
  margin: 2rem 0;
}

.selected-player-text {
  margin-bottom: 0;
}
</style>
