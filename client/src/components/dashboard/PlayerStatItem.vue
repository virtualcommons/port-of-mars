<template>
  <div class="c-player-stat-item container">
    <div class="title-wrapper row">
      <div class="title col-12">
        <p>Tournament Name: {{ playerStatItem.tournamentName }}</p>
      </div>
    </div>
    <div class="content-wrapper row">
      <div class="content col-12">
        <div class="section">
          <p>
            <span>Date:&nbsp;</span>
            {{ new Date(playerStatItem.time).toDateString() }}
          </p>
        </div>
        <div class="section">
          <p><span>Round:&nbsp;</span>{{ playerStatItem.round }}</p>
        </div>
        <div class="section">
          <p><span>Winner:&nbsp;</span>{{ playerStatItem.winner }}</p>
        </div>
        <div class="section">
          <p><span>Points:&nbsp;</span>{{ playerStatItem.points }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { GameMeta, Role } from '@port-of-mars/shared/types';

@Component({})
export default class PlayerStatItem extends Vue {
  @Prop() private playerStatItem!: GameMeta & { points: number; winner: Role };
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/dashboard/PlayerStatItem.scss';
</style>
