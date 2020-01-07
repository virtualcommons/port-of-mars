<template>
  <div class="event-vote-for-player-single">
    <p class="selected-player-title">Selected Player</p>
    <div class="player-frame-container">
      <div
        v-for="member in members"
        class="player-frame"
        v-bind:class="{ 'selected-background': member == selectedPlayer }"
        :key="member + 1"
      >
        <img
          @click="handleSelectPlayer(member)"
          :src="require(`@/assets/characters/${member}.png`)"
          alt="Player"
        />
      </div>
    </div>
    <p
      :style="selectedPlayer === 'None Selected' ? 'color: var(--space-white-opaque-2)' : ''"
      class="selected-player-text"
    >
      {{ selectedPlayer }}
    </p>
    <button type="button" name="Submit Button" @click="submitSelectedPlayer">Done</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Role } from 'shared/types';

@Component({})
export default class VoteForPlayerSingle extends Vue {
  private selectedPlayer = 'None Selected';

  get members(): Array<string> {
    // if (this.$store.state.role !== '') {
    //   return ['Researcher', 'Pioneer', 'Curator', 'Entrepreneur', 'Politician'].filter(
    //     name => name !== this.$store.state.role
    //   );
    // }
    return ['Researcher', 'Pioneer', 'Curator', 'Entrepreneur', 'Politician'];
  }

  private handleSelectPlayer(member: Role): void {
    this.selectedPlayer = member;
    console.log('MEMBER: ', this.selectedPlayer);
  }

  private submitSelectedPlayer(): void {
    console.log('SUBMIT MEMBER: ', this.selectedPlayer);
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/events/views/VoteForPlayerSingle.scss';
</style>
