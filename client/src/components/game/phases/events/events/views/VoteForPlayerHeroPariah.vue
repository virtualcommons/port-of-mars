<template>
  <div class="event-vote-for-player-hero-pariah">
    <!-- VOTE :: hero or pariah -->
    <p class="title" v-if="!decidedHeroOrPariah">Select Hero or Pariah</p>
    <b-form v-if="!decidedHeroOrPariah">
      <b-form-radio-group
        :options="options"
        :value="voteHeroOrPariah"
        @change="submitHeroOrPariah"
        button-variant="outline-warning"
        buttons
        size="lg"
      >
      </b-form-radio-group>
    </b-form>

    <p class="voted m-4" v-if="!decidedHeroOrPariah && voteHeroOrPariah">You voted for a <strong>{{ voteHeroOrPariah
      }}</strong>.</p>
    <p class="voted m-3" v-if="!decidedHeroOrPariah && voteHeroOrPariah">Collecting other players'
      votes... </p>
    <b-spinner label="small spinner" small v-if="!decidedHeroOrPariah && voteHeroOrPariah"/>

    <!-- VOTE :: player to be hero or pariah -->
    <p v-if="decidedHeroOrPariah" class="title">Select a {{ decidedHeroOrPariah }}</p>

    <!-- vote for player -->
    <div v-if="decidedHeroOrPariah" class="m-4">
      <div class="player-frame-container">
        <div
          :key="player"
          class="player-frame"
          v-bind:class="{ 'selected-background': player === role }"
          v-for="player in roles"
        >
          <img
            :src="require(`@port-of-mars/client/assets/characters/${player}.png`)"
            @click="selectRole(player)"
            alt="Player"
          />
        </div>
      </div>
      <p class="voted m-5" v-if="!role">No player selected.</p>
      <p class="voted m-5" v-else><strong>{{ role }}</strong></p>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Inject, Vue} from 'vue-property-decorator';
  import {Role, ROLES} from '@port-of-mars/shared/types';
  import {GameRequestAPI} from '@port-of-mars/client/api/game/request';

  @Component({})
  export default class VoteForPlayerHeroPariah extends Vue {
    @Inject() api!: GameRequestAPI;
    voteHeroOrPariah: 'hero' | 'pariah' | '' = '';
    role: Role | '' = '';

    options = [
      {text: 'Hero', value: 'hero'},
      {text: 'Pariah', value: 'pariah'}
    ]

    get decidedHeroOrPariah() {
      return this.$tstore.getters.heroOrPariah;
    }

    get roles(): Array<Role> {
      return ROLES;
    }

    private submitHeroOrPariah(vote: 'hero' | 'pariah') {
      this.voteHeroOrPariah = vote;
      if (this.voteHeroOrPariah) {
        this.api.saveHeroOrPariah(this.voteHeroOrPariah);
      }
    }

    private selectRole(member: Role): void {
      this.role = member;
      this.api.saveHeroOrPariahRole(this.role);
    }

  }
</script>

<style lang="scss" scoped>
  @import '@port-of-mars/client/stylesheets/game/phases/events/events/views/VoteForPlayerHeroPariah.scss';
</style>
