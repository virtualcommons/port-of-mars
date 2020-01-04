<template>
  <!-- VOTE_YES_NO -->
  <div v-if="eventView === 'VOTE_YES_NO'" class="event-yes-no-vote">
    <p>Please select an option:</p>
    <div class="event-yes-no-vote-buttons">
      <button type="button" name="yes button" @click="handleYesNoVote(true)">Yes</button>
      <button type="button" name="no button" @click="handleYesNoVote(false)">No</button>
    </div>
  </div>

  <!-- VOTE_FOR_PLAYER_SINGLE -->
  <div v-else-if="eventView === 'VOTE_FOR_PLAYER_SINGLE'" class="event-for-player-single">
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

  <!-- VOTE_FOR_PLAYER_HERO_PARIAH -->

  <div v-else-if="eventView === 'VOTE_FOR_PLAYER_HERO_PARIAH'" class="event-for-player-single">
    <div class="player-frame-container">
      <div
        v-for="member in members"
        class="player-frame"
        :style="member === selectedHero ? 'backgroundColor: var(--space-orange)' : ''"
      >
        <img
          @click="selectHero(member)"
          :src="require(`@/assets/characters/${member}.png`)"
          alt="Player"
        />
      </div>
    </div>
    <p class="selected-hero-text">
      Selected Hero:
      <span :style="selectedHero === 'None Selected' ? 'color: var(--space-white-opaque-2)' : ''">{{
        selectedHero
      }}</span>
    </p>

    <div class="player-frame-container">
      <div
        v-for="member in members"
        class="player-frame"
        :style="member === selectedPariah ? 'backgroundColor: var(--space-orange)' : ''"
      >
        <img
          @click="selectPariah(member)"
          :src="require(`@/assets/characters/${member}.png`)"
          alt="Player"
        />
      </div>
    </div>
    <p class="selected-pariah-text">
      Selected Pariah:
      <span
        :style="selectedPariah === 'None Selected' ? 'color: var(--space-white-opaque-2)' : ''"
        >{{ selectedPariah }}</span
      >
    </p>

    <button type="button" name="button" @click="submitHeroPariah">Done</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ResourceAmountData, Resource, Role } from 'shared/types';

@Component({})
export default class EventVote extends Vue {
  @Prop({ default: '' }) private eventView!: string;

  // VOTE_YES_NO
  handleYesNoVote(selection: boolean): void {
    console.log(selection);
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

  // VOTE_FOR_PLAYER_HERO_PARIAH

  private selectedHero = 'None Selected';
  private selectedPariah = 'None Selected';

  selectHero(member: Role) {
    this.selectedHero = member;
    console.log('SELECTED HERO: ', this.selectedHero);
  }

  selectPariah(member: Role) {
    this.selectedPariah = member;
    console.log('SELECTED PARIAH: ', this.selectedPariah);
  }

  submitHeroPariah() {
    // Note: Do we want to allow hero and pariah to be same person?
    console.log('SUBMITTED HERO: ', this.selectedHero);
    console.log('SUBMITTED PARIAH: ', this.selectedPariah);
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/events/EventVote.scss';
</style>
