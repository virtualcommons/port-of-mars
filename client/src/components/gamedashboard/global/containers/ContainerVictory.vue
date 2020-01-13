<template>
  <div class="container-victory">
    <h1 class="animated pulse slower infinite">Victory</h1>
    <div class="text">
      <p>
        Despite all doubts, you have done it. Thanks to you future generations
        can flourish on planet Mars.
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
export default class ContainerVictory extends Vue {
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
@import '@/stylesheets/gamedashboard/global/containers/ContainerVictory.scss';
</style>
