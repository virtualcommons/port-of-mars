<template>
  <div class="c-player">
    <div class="picture" :style="frameColor">
      <img :src="playerRoleImage" alt="Player Image" />
    </div>
    <div class="information">
      <p class="title">Your Role</p>
      <p class="role">{{ playerRole }}</p>
      <p class="score">Score: {{ playerScore }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Role } from '@port-of-mars/shared/types';

@Component({
  components: {}
})
export default class Player extends Vue {
  get playerRole(): Role {
    return this.$tstore.state.role;
  }

  get playerScore(): number {
    return this.playerRole
      ? this.$tstore.state.players[this.playerRole].victoryPoints
      : 0;
  }

  get frameColor(): object {
    return this.playerRole
      ? { backgroundColor: `var(--color-${this.playerRole})` }
      : { backgroundColor: `var(--color-Researcher)` };
  }

  get playerRoleImage(): any {
    return this.playerRole
      ? require(`@port-of-mars/client/assets/characters/${this.playerRole}.png`)
      : require(`@port-of-mars/client/assets/characters/Researcher.png`);
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/top/Player.scss';
</style>
