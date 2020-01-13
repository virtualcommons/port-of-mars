<template>
  <div class="container-defeat">
    <h1 class="animated pulse slower infinite">Game Over</h1>
    <div class="text">
      <p>
        Upkeep has reached zero. However, your efforts will inspire a new
        generation to continue your legacy on planet Mars.
      </p>
      <p>Thank you for playing.</p>
    </div>
    <div class="buttons">
      <button @click="handleRestart">Restart the Game</button>
      <button @click="handleExit">Exit</button>
    </div>
  </div>
</template>

<script lang="ts">
import {Vue, Component, InjectReactive, Inject} from 'vue-property-decorator';
import { GameRequestAPI } from '@/api/game/request';

@Component({})
export default class ContainerDefeat extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  private handleRestart() {
    this.api.resetGame();
  }

  private handleExit() {
    console.log('EXIT GAME');
  }
}
</script>

<style lang="scss" scoped>
@import '~animate.css/source/attention_seekers/pulse.css';
@import '@/stylesheets/gamedashboard/global/containers/ContainerDefeat.scss';
</style>
