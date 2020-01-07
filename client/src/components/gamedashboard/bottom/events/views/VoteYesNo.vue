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

@Component({})
export default class VoteYesNo extends Vue {
  private handleVote(selection: boolean): void {
    console.log(selection);
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/bottom/events/views/VoteYesNo.scss';
</style>
