<template>
  <div class="event-vote-for-player-single">
    <p class="selected-player-title">Selected Player</p>
    <div class="player-frame-container">
      <div
        v-for="member in members"
        class="player-frame"
        v-bind:class="{ 'selected-background': member === selectedPlayer }"
        :key="member + 1"
      >
        <img
          @click="handleSelectPlayer(member)"
          :src="require(`@port-of-mars/client/assets/characters/${member}.png`)"
          alt="Player"
        />
      </div>
    </div>
    <p
      :style="selectedPlayer === 'None Selected' ? 'color: var(--light-shade-25)' : ''"
      class="selected-player-text"
    >
      {{ selectedPlayer }}
    </p>
    <button
      type="button"
      name="Submit Button"
      :disabled="selectedPlayer === null"
      @click="submitSelectedPlayer"
    >
      Done
    </button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from "vue-property-decorator";
import { Role, ROLES } from "@port-of-mars/shared/types";
import { GameRequestAPI } from "@port-of-mars/client/api/game/request";
import _ from "lodash";

@Component({})
export default class VoteForPlayerSingle extends Vue {
  selectedPlayer: Role | null = null;

  @Inject()
  api!: GameRequestAPI;

  get members(): Array<Role> {
    return ROLES;
  }

  handleSelectPlayer(member: Role): void {
    this.selectedPlayer = member;
    console.log("MEMBER: ", this.selectedPlayer);
  }

  submitSelectedPlayer(): void {
    if (!_.isNull(this.selectedPlayer)) {
      console.log("SUBMIT MEMBER: ", this.selectedPlayer);
      this.api.voteForPhilanthropist(this.selectedPlayer);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@port-of-mars/client/stylesheets/game/phases/events/events/views/VoteForPlayerSingle.scss";
</style>
