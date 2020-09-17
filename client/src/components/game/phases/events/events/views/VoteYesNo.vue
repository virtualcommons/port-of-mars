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
        :value="playerVote"
      >
      </b-form-radio-group>
    </b-form>

    <p :style="!playerVote ? 'color: rgba(0, 0, 0, 0); padding-top: 2rem' : ''"
       :class="{'selected-button-text': playerVote }" v-if="playerVote !== null"
    >
      You have selected <strong>{{ playerVote ? 'Yes' : 'No' }}</strong>.
    </p>
  </div>
</template>

<script lang="ts">
  import {Component, Inject, Vue} from 'vue-property-decorator';
  import {GameRequestAPI} from '@port-of-mars/client/api/game/request';

  @Component({})
  export default class VoteYesNo extends Vue {
    @Inject() api!: GameRequestAPI;
    playerVote: boolean | null = null;

    options = [
      {text: 'Yes', value: true},
      {text: 'No', value: false}
    ]

    get playerRole() {
      return this.$tstore.state.role;
    }


    vote(v: boolean) {
      console.log('PERSONAL GAIN VOTE: ', v)
      this.playerVote = v;
      this.api.savePersonalGainVote(this.playerVote ?? false);

    }
  }
</script>

<style lang="scss" scoped>
  @import '@port-of-mars/client/stylesheets/game/phases/events/events/views/VoteYesNo.scss';
</style>
