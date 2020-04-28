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
    <div class="winners">
      <p class="title">Winners</p>
      <div v-for="winner in winners" class="winner">
        <p>{{ winner }}</p>
      </div>
    </div>
    <div class="marslog-wrapper row">
      <div class="marslog col-6">
        <div class="wrapper">
          <div
            v-for="(log, index) in logs"
            :style="logColor(log)"
            :key="log.timestamp + Math.random()"
            class="message"
          >
            <p class="category">{{ log.category }}</p>
            <p class="final-log" v-if="index === 0">Final Log</p>
            <p v-if="index !== 0" class="list">
              <span>
                Log: {{ logs.length - index }} / {{ logs.length }}
              </span>
            </p>
            <p class="content">{{ log.content }}</p>
            <p class="time">
              <span>[ </span>{{ logTime(log.timestamp) }}<span> ]</span>
            </p>
            <div v-if="delineateRound(index, logs)" class="round row"><b>Round {{ log.round - 1 }}</b></div>
          </div>

        </div> <!--end wrapper-->
      </div>
    </div>
    <div class="buttons">
      <button @click="handleRestart">Restart the Game</button>
      <button @click="handleExit">Exit</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, InjectReactive, Inject } from 'vue-property-decorator';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { MarsLogData, MarsLogMessageData } from "@port-of-mars/shared/types";

@Component({})
export default class ContainerVictory extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  eventName: string = '';

  categoryColorMap = new Map([
    ['SYSTEM HEALTH- GAIN', 'var(--marslog-green)'],
    ['SYSTEM HEALTH- DROP', 'var(--marslog-red)'],
    ['TRADE', 'var(--space-white-opaque-1)'],
    [`MARS EVENT: ${ this.eventName }`, 'var(--space-white-opaque-1)']
  ]);

  get logs() {
    return this.$store.getters.logs.reverse();
  }

  private delineateRound(index: number, logs: MarsLogMessageData[]): boolean {
    let currentIndex: number  = index;
    let nextIndex: number = index + 1;

    console.log('currentIndex ', currentIndex);

    if (!logs[nextIndex]) {
      console.log('undefined');
      return false
    }
    else if (logs[currentIndex].round !== logs[nextIndex].round) {
      console.log(`CURRENT ROUND: ${logs[currentIndex].round}`);
      console.log(`PREVIOUS ROUND: ${logs[nextIndex].round}`);
      return true;
    }
    else return false;
  }

  private logTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }

  private logColor(log: MarsLogData) {
    console.log(log.category);
    if (log.category == 'SYSTEM HEALTH- DROP')
      return { backgroundColor: 'var(--marslog-red)' };
    else if (log.category == 'SYSTEM HEALTH- GAIN')
      return { backgroundColor: 'var(--marslog-green)' };
    else if (log.category == 'TRADE')
      return { backgroundColor: 'var(--marslog-purple)' };
    else if (log.category.includes('Mars Event'))
      return { backgroundColor: 'var(--marslog-orange)' };
    else return { backgroundColor: 'var(--space-white-opaque-1)' };
  }

  private handleRestart() {
    this.api.resetGame();
  }

  private handleExit() {
    console.log('EXIT GAME');
  }

  get winners() {
    return this.$tstore.state.winners;
  }
}
</script>

<style lang="scss" scoped>
@import '~animate.css/source/attention_seekers/pulse.css';
@import '@port-of-mars/client/stylesheets/root/ContainerVictory.scss';
</style>
