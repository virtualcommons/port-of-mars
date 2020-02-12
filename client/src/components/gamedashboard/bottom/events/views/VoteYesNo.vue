<template>
  <div class="vote-yes-no">
    <p>Please select an option:</p>
    <div class="buttons">
      <button @click="handleVote(true)" type="button" name="Yes Button">Yes</button>
      <button @click="handleVote(false)" type="button" name="No Button">No</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Role, ROLES, CURATOR, ENTREPRENEUR, PIONEER, POLITICIAN, RESEARCHER } from 'shared/types';

@Component({})
export default class VoteYesNo extends Vue {
  private defaultVote: boolean = true;
  private voteResults: { [role in Role]: boolean} = {
    [CURATOR]: this.defaultVote,
    [ENTREPRENEUR]: this.defaultVote,
    [PIONEER]: this.defaultVote,
    [POLITICIAN]: this.defaultVote,
    [RESEARCHER]: this.defaultVote
  };

  get playerRole() {
      return this.$tstore.state.role;
  }

  private handleVote(selection: boolean): void {
    this.voteResults[this.playerRole] = selection; 
  }
  
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/events/views/VoteYesNo.scss';
</style>
