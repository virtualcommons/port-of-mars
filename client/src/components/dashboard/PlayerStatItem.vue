<template>
  <div class="c-player-stat-item container">
    <div class="title-wrapper row">
      <div class="title col-12">
        <p>{{ status }} Round {{ playerStatItem.round }}</p>
      </div>
    </div>
    <div class="content-wrapper row">
      <div class="content col-12">
        <div class="section">
          <p>
            <span>Date:&nbsp;</span>
            {{ new Date(playerStatItem.time).toDateString() }}
          </p>

          <b-list-group v-for="playerScore in playerStatItem.playerScores">
            <b-list-group-item :active="playerScore.role === role" class="d-flex justify-content-between align-items-center">
              {{ playerScore.role }}
              <b-badge pill :variant="getVariant(playerStatItem.victory, playerScore.winner)">{{ playerScore.points }}</b-badge>
            </b-list-group-item>
          </b-list-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator';
  import * as types from '@port-of-mars/shared/types';

  @Component({})
  export default class PlayerStatItem extends Vue {
    @Prop() private playerStatItem!: types.PlayerStatItem;

    get role() {
      return this.$tstore.getters.player.role;
    }

    getActive(victory: boolean, winner: boolean) {
      return victory && winner;
    }

    getVariant(victory: boolean, winner: boolean) {
      return victory && winner ? 'success' : 'danger';
    }

    get status() {
      return this.playerStatItem.victory ? 'Victory' : 'Defeat';
    }
  }
</script>

<style lang="scss" scoped>
  @import '@port-of-mars/client/stylesheets/dashboard/PlayerStatItem.scss';
</style>
