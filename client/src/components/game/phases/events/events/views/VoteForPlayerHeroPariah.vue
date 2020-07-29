<template>
  <div class="event-vote-for-player-hero-pariah">
    <!-- vote hero or pariah -->
    <p v-if="!decidedHeroOrPariah" class="hero-title">Select Hero or Pariah</p>
    <b-form>
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

    <p v-if="voteHeroOrPariah">You voted for a {{ voteHeroOrPariah }}.</p>
    <p v-if="!decidedHeroOrPariah">Please wait while we collect
      other players' votes. </p>
    <b-spinner v-if="!decidedHeroOrPariah" small label="small spinner" />

    <p v-if="decidedHeroOrPariah" class="hero-title">Select a {{ decidedHeroOrPariah }}</p>

    <!-- vote player to be hero or pariah -->
    <div v-if="decidedHeroOrPariah">
<!--      <p class="pariah-title">Select a {{ decidedHeroOrPariah }}</p>-->

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

      <p
        :style="role === 'None Selected' ? 'color: var(--light-shade-25)' : ''"
        class="selected-pariah-text"
      >
        {{ role }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Inject, Prop, Vue, Watch} from 'vue-property-decorator';
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
        console.log('VOTED FOR: ', this.voteHeroOrPariah);
      }
    }

    private selectRole(member: Role): void {
      this.role = member;
      this.api.saveHeroOrPariahRole(this.role);
      console.log('VOTED ROLE: ', this.role);
    }

  }
</script>

<style lang="scss" scoped>
  @import '@port-of-mars/client/stylesheets/game/phases/events/events/views/VoteForPlayerHeroPariah.scss';
</style>
