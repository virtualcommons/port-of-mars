<template>
  <div class="container-defeat">
    <h1 class="animated pulse slower infinite gameOver-text">Game Over</h1>
    <div class="transmission-info">
      <h3>Replaying Logs before death...</h3>

      <div class="message-container">
        <div v-for="(log,index) in marsLogEvents" :style="marsLogColor(log)" 
        class="message"
        v-bind="{class:`animated fadeInLeft delay-${0.6*index}s`}"
        :key="log.timestamp">
          <div class="header">
            <p class="category">{{ log.category }}</p>
            <div class="event-number">
              <p class="final-log" v-if="index==0">Final Log</p>
              <p v-else>Log Entry <span class="list">#{{marsLogEvents.length-index}}/{{marsLogEvents.length}}</span></p>
            </div>
          </div>
          <p class="content">{{ log.content }}</p>
          <p class="time">
            <span>[ </span>{{ marsLogTime(log.timestamp) }}<span> ]</span>
          </p>
        </div>
      </div>
      <h4 class="death-text">
        Final Game State:<span class="death"
          ><i>System Health reached zero</i></span
        >
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
import { Vue, Component, InjectReactive, Inject } from 'vue-property-decorator';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import {MarsLogData, ROLES} from '@port-of-mars/shared/types';

@Component({})
export default class ContainerDefeat extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  // private handleRestart() {
  //   this.api.resetGame();
  // }

  get marsLogEvents(){
    console.log(this.$store.getters.marsLogEvents);
    return this.$store.getters.logs.reverse();
  }

  marsLogTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }

  private handleExit() {
    console.log('EXIT GAME');
  }

  marsLogColor(log: MarsLogData) {
    console.log(log.category)
    if(log.category == 'SYSTEM HEALTH- DROP') return { backgroundColor: 'var(--marslog-red)'};
    else if(log.category == 'SYSTEM HEALTH- GAIN') return { backgroundColor: 'var(--marslog-green)'};
    else if(log.category == 'TRADE') return { backgroundColor: 'var(--marslog-purple)'};
    else if(log.category.includes('Mars Event')) return { backgroundColor: 'var(--marslog-orange)'};
    else return { backgroundColor: 'var(--space-white-opaque-1)' }
  }

}
</script>

<style lang="scss" scoped>
@import '~animate.css/source/attention_seekers/pulse.css';
@import '~animate.css/source/fading_entrances/fadeInLeft.css';
@import '@port-of-mars/client/stylesheets/root/ContainerDefeat.scss';
</style>
