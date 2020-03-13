<template>
  <div class="container-defeat">
    <h1 class="animated pulse slower infinite gameOver-text">Game Over</h1>
    <div class="transmission-info">
      <h3>Replaying Logs before death...</h3>

      <div class="message-container">
        <div v-for="log in marsLogEvents" :style="marsLogColor(log)"  class="message" :key="log.timestamp">
          <p class="category">{{ log.category }}</p>
          <p class="content">{{ log.content }}</p>
          <p class="time"><span>[ </span>{{ marsLogTime(log.timestamp) }}<span> ]</span></p>
        </div>
      </div>
      <h4 class="death-text">Final Game State:<span class="death"><i>System Health reached zero</i></span></h4>
    </div>

    <div class="thanks">
      <p>Thank you for playing</p>
      <div class="buttons">
        <button @click="handleRestart">Restart the Game</button>
        <button @click="handleExit">Exit</button>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import {Vue, Component, InjectReactive, Inject} from 'vue-property-decorator';
import { GameRequestAPI } from '@/api/game/request';
import {MarsLogData} from '@port-of-mars/shared/types';

@Component({})
export default class ContainerDefeat extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  private handleRestart() {
    this.api.resetGame();
  }

  get marsLogEvents(){
    console.log(this.$store.getters.marsLogEvents);
    return this.$store.getters.logs;
  }

  marsLogTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }

  private handleExit() {
    console.log('EXIT GAME');
  }

  marsLogColor(log: MarsLogData) {
    console.log(log.category)
    switch (log.category) {
      case 'System Health: Drop':
        return { backgroundColor: 'var(--marslog-red)' };
      case 'System Health: Gain':
        return { backgroundColor: 'var(--marslog-green)' };
      case 'Trade':
        return { backgroundColor: 'var(--marslog-purple)' };
      default:
        return { backgroundColor: 'var(--space-white-opaque-1)' };
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~animate.css/source/attention_seekers/pulse.css';
@import '@/stylesheets/gamedashboard/global/containers/ContainerDefeat.scss';
</style>
