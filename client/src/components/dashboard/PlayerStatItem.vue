<template>
  <b-row>
    <b-col>
      <p>{{ status }} Round {{ playerStatItem.round }}</p>
      <p>
        <span>Date: </span>
        {{ dateString }}
      </p>
      <b-list-group v-for="playerScore in playerStatItem.playerScores" :key="playerScore.role">
        <b-list-group-item :active="playerScore.isSelf" class="d-flex justify-content-between align-items-center" variant="warning">
          {{ playerScore.role }}
          <template v-if="playerScore.isSelf"> (YOUR ROLE) </template>
          <b-badge pill :variant="getVariant(playerStatItem.victory, playerScore.winner)">{{ playerScore.points }}</b-badge>
        </b-list-group-item>
      </b-list-group>
    </b-col>
  </b-row>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator';
  import * as types from '@port-of-mars/shared/types';

  @Component({})
  export default class PlayerStatItem extends Vue {
    @Prop() private playerStatItem!: types.PlayerStatItem;

    get dateString() {
      const date = new Date(this.playerStatItem.time);
      return date.toLocaleString();
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