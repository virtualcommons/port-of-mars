<template>
  <div class="event-vote-for-player-hero-pariah">
    <p class="hero-title">Select a Hero</p>

    <div class="player-frame-container">
      <div
        v-for="member in members"
        class="player-frame"
        v-bind:class="{ 'selected-background': member === selectedHero }"
        :key="member + 2"
      >
        <img
          @click="selectHero(member)"
          :src="require(`@port-of-mars/client/assets/characters/${member}.png`)"
          alt="Player"
        />
      </div>
    </div>

    <p
      :style="selectedHero === 'None Selected' ? 'color: var(--space-white-opaque-2)' : ''"
      class="selected-hero-text"
    >
      {{ selectedHero }}
    </p>

    <p class="pariah-title">Select a Pariah</p>

    <div class="player-frame-container">
      <div
        v-for="member in members"
        class="player-frame"
        v-bind:class="{ 'selected-background': member === selectedPariah }"
        :key="member + 3"
      >
        <img
          @click="selectPariah(member)"
          :src="require(`@port-of-mars/client/assets/characters/${member}.png`)"
          alt="Player"
        />
      </div>
    </div>

    <p
      :style="selectedPariah === 'None Selected' ? 'color: var(--space-white-opaque-2)' : ''"
      class="selected-pariah-text"
    >
      {{ selectedPariah }}
    </p>

    <button type="button" name="button" @click="submitHeroPariah">Done</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Role } from '@port-of-mars/shared/types';

@Component({})
export default class VoteForPlayerHeroPariah extends Vue {
  private selectedHero = 'None Selected';
  private selectedPariah = 'None Selected';

  get members(): Array<string> {
    // if (this.$store.state.role !== '') {
    //   return ['Researcher', 'Pioneer', 'Curator', 'Entrepreneur', 'Politician'].filter(
    //     name => name !== this.$store.state.role
    //   );
    // }
    return ['Researcher', 'Pioneer', 'Curator', 'Entrepreneur', 'Politician'];
  }

  private selectHero(member: Role): void {
    this.selectedHero = member;
    console.log('SELECTED HERO: ', this.selectedHero);
  }

  private selectPariah(member: Role): void {
    this.selectedPariah = member;
    console.log('SELECTED PARIAH: ', this.selectedPariah);
  }

  private submitHeroPariah(): void {
    // Note: Do we want to allow hero and pariah to be same person?
    console.log('SUBMITTED HERO: ', this.selectedHero);
    console.log('SUBMITTED PARIAH: ', this.selectedPariah);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/events/events/views/VoteForPlayerHeroPariah.scss';
</style>
