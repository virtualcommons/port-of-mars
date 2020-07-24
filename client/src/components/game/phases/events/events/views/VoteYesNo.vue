<template>
  <div class="vote-yes-no">
    <p>Please select an option:</p>
    <b-form>
      <b-form-radio-group
        :options="options"
        @change="vote"
        button-variant="outline-warning"
        buttons
        size="lg"
        v-model="playerVote"
      >
      </b-form-radio-group>
    </b-form>

    <p :style="!playerVote ? 'color: rgba(0, 0, 0, 0); padding-top: 2rem' : ''"
       v-bind:class="{'selected-button-text': playerVote }"
    >
      You have selected <strong>{{ playerVote }}</strong>.
    </p>
  </div>
</template>

<script lang="ts">
  import {Component, Inject, Vue} from 'vue-property-decorator';
  import {GameRequestAPI} from '@port-of-mars/client/api/game/request';

  @Component({})
  export default class VoteYesNo extends Vue {
    @Inject() api!: GameRequestAPI;
    playerVote: string = '';
    select!: boolean;

    options = [
      {text: 'Yes', value: 'Yes'},
      {text: 'No', value: 'No'}
    ]

    get playerRole() {
      return this.$tstore.state.role;
    }


    private vote() {
      this.select = this.playerVote === 'Yes';
      const voteResults = {role: this.playerRole, vote: this.select};
      this.api.savePersonalGainVote(voteResults);

    }
  }
</script>

<style lang="scss" scoped>
  @import '@port-of-mars/client/stylesheets/game/phases/events/events/views/VoteYesNo.scss';
</style>
