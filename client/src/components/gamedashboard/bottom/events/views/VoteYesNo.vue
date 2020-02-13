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
  RESEARCHER
} from 'shared/types';
import { GameRequestAPI } from '@/api/game/request';

@Component({})
export default class VoteYesNo extends Vue {
  @Inject() api!: GameRequestAPI;

  get playerRole() {
    return this.$tstore.state.role;
  }

  private handleVote(selection: boolean): void {
    const voteResults = { role: this.playerRole, vote: selection };
    this.api.savePersonalGainVote(voteResults);
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/events/views/VoteYesNo.scss';
</style>
