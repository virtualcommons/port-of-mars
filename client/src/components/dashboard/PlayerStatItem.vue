<template>
  <b-row>
    <b-col>
      <h4>
        <b-badge :variant="status === 'Victory' ? 'success' : 'danger'">{{ status }}</b-badge> 
        Round {{ playerStatItem.round }} 
        <span class='float-right'>{{ dateString }}</span>
      </h4>
      <b-list-group horizontal>
        <b-list-group-item 
        v-for="playerScore in playerStatItem.playerScores" 
        :key="playerScore.role"
        class="d-flex flex-fill justify-content-between align-items-center"
        variant="light">
        <span class='score'>
          {{ playerScore.role }}
          <template v-if="playerScore.isSelf">(YOUR ROLE)</template>
        </span>
        <span class='score'>
          <b-badge pill :variant="getVariant(playerStatItem.victory, playerScore.winner)">{{ playerScore.points }} points</b-badge>
        </span>
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
      return date.toString();
    }

    getActive(victory: boolean, winner: boolean) {
      return victory && winner;
    }

    getVariant(victory: boolean, winner: boolean) {
      return victory && winner ? 'success' : 'secondary';
    }

    get status() {
      return this.playerStatItem.victory ? 'Victory' : 'Defeat';
    }
  }
</script>
<style scoped>
.score {
  font-size: 1.2rem;
}
</style>