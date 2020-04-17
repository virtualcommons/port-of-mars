<template>
  <div class="container-defeat">
    <h1 class="game-over-text animated pulse slower infinite">Game Over</h1>
    <div class="transmission-info">
      <h3>Replaying Logs before death...</h3>

      <!-- mars log entries -->
      <div class="message-container">
        <div v-for="(log, index) in logs"
             v-bind="{class:`animated fadeInLeft delay-${0.6*index}s`}"
             :style="logColor(log)"
             class="message"
        >
          <div class="header">
            <p class="category">{{ log.category }}</p>
            <div class="event-number">
              <p class="final-log" v-if="index===0">Final Log</p>
              <p v-else>Log Entry
                <span class="list">#{{logs.length-index}}/{{logs.length}}</span>
              </p>
            </div>
          </div>
          <p class="content">{{ log.content }}</p>
          <p class="time">
            <span>[ </span>{{ logTime(log.timestamp) }}<span> ]</span>
          </p>
        </div>
      </div>
      <!-- end mars log entries -->

      <h4 class="death-text">
        Final Game State:
        <span class="death">
          <i>System Health reached zero</i>
        </span>
      </h4>
    </div>

    <div class="thanks">
      <p>Thank you for playing</p>
      <div class="buttons">
        <!-- <button @click="handleRestart">Restart the Game</button> -->
        <router-link :to="'dashboard'">
          <button>Exit</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Inject, Vue } from 'vue-property-decorator';
  import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
  import { MarsLogData } from '@port-of-mars/shared/types';

  @Component({})
  export default class ContainerDefeat extends Vue {
    @Inject() readonly api!: GameRequestAPI;

    // private handleRestart() {
    //   this.api.resetGame();
    // }
    get logs() {
      return this.$tstore.getters.logs.reverse();
    }

    logTime(timestamp: number) {
      return new Date(timestamp).toLocaleTimeString();
    }

    logColor(log: MarsLogData) {
      if (log.category == 'SYSTEM HEALTH: DECREASE') return {backgroundColor: 'var(--marslog-red)'};
      else if (log.category == 'SYSTEM HEALTH: INCREASE') return {backgroundColor: 'var(--marslog-green)'};
      else if (log.category == 'TRADE') return {backgroundColor: 'var(--marslog-purple)'};
      else if (log.category.includes('Mars Event')) return {backgroundColor: 'var(--marslog-orange)'};
      else return {backgroundColor: 'var(--space-white-opaque-1)'}
    }

    private handleExit() {
      console.log('EXIT GAME');
    }

  }
</script>

<style lang="scss" scoped>
  @import '~animate.css/source/attention_seekers/pulse.css';
  @import '~animate.css/source/fading_entrances/fadeInLeft.css';
  @import '@port-of-mars/client/stylesheets/root/ContainerDefeat.scss';
</style>
