<template>
  <div class="c-gameview-defeat container">
    <div class="title-wrapper row">
      <div class="title col-12">
        <h1>Port of Mars</h1>
        <h2 class="animated pulse slower infinite">Game Over</h2>
      </div>
    </div>
    <div class="content-wrapper row">
      <div class="content col-12">
        <h2>Your team has perished. See below for details.</h2>
      </div>
    </div>
    <div class="marslog-wrapper row">
      <div class="marslog col-6">
        <div class="wrapper">
          <div
            v-for="(log, index) in logs"
            :style="marsLogColor(log)"
            :key="log.timestamp + Math.random()"
            class="message"
          >
            <p class="category">{{ log.category }}</p>
            <p class="final-log" v-if="index === 0">Final Log</p>
            <p v-if="index !== 0" class="list">
              <span
                >N<sup>o.</sup> {{ logs.length - index }}/{{
                  logs.length
                }}</span
              >
            </p>
            <p class="content">{{ log.content }}</p>
            <p class="time">
              <span>[ </span>{{ marsLogTime(log.timestamp) }}<span> ]</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="footnote-wrapper row">
      <div class="footnote col-12">
        <h2>Thank you for playing.</h2>
        <div class="buttons">
          <router-link :to="'dashboard'">
            <button class="exit">Exit</button>
          </router-link>
          <button
            v-if="isDevModeEnabled"
            @click="handleRestart"
            class="restart"
          >
            Restart (Dev)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, InjectReactive, Inject } from 'vue-property-decorator';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { MarsLogData, ROLES } from '@port-of-mars/shared/types';
import { isDev, isStaging } from '@port-of-mars/shared/settings';

@Component({})
export default class ContainerDefeat extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  // NOTE :: MODIFIED MARS LOG

  get logs() {
    // return this.$store.getters.logs.reverse();
    return [];
  }

  private marsLogTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }

  private marsLogColor(log: MarsLogData) {
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

  // NOTE :: DEVELOPER SHORTCUT(S)

  get isDevModeEnabled() {
    return isDev() || isStaging();
  }

  private handleRestart() {
    this.api.resetGame();
  }
}
</script>

<style lang="scss" scoped>
@import '~animate.css/source/attention_seekers/pulse.css';
@import '@port-of-mars/client/stylesheets/root/ContainerDefeat.scss';
</style>
