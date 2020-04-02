<template>
  <div class="vote-yes-no">
    <p>Please select an option:</p>
    <div class="buttons">
      <button @click="handleVote(true)" type="button" name="Yes Button">
        Yes
      </button>
      <button @click="handleVote(false)" type="button" name="No Button">
        No
      </button>
    </div>

    <p :style="!playerVote ? 'color: rgba(0, 0, 0, 0); padding-top: 2rem' : ''"
        v-bind:class="{'selected-button-text': playerVote }"
        >
      You have selected {{ playerVote }}.
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, InjectReactive, Inject } from 'vue-property-decorator';
import {
  Role,
  ROLES,
  CURATOR,
  ENTREPRENEUR,
  PIONEER,
  POLITICIAN,
  RESEARCHER,
} from '@port-of-mars/shared/types';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';

@Component({})
export default class VoteYesNo extends Vue {
  @Inject() api!: GameRequestAPI;
  playerVote: string = '';
  selectedButton = document.activeElement;

  get playerRole() {
    return this.$tstore.state.role;
  }

  private handleVote(selection: boolean) {
    const voteResults = { role: this.playerRole, vote: selection };
    this.api.savePersonalGainVote(voteResults);
    if (selection) {
      this.playerVote = 'Yes';
    } else {
      this.playerVote = 'No';
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/phases/eventsPhase/events/views/VoteYesNo.scss';
</style>
