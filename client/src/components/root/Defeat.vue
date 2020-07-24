<template>
  <div fliud class="defeat">
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
            :key="log.id"
            :style="{ backgroundColor: categoryColorMap.get(log.category) }"
            class="message"
            v-for="(log, index) in logs"
          >
            <p class="category">{{ log.category }}</p>
            <p class="final-log" v-if="index === 0">Final Log</p>
            <p class="list" v-if="index !== 0">
              <span> Log: {{ logs.length - index }} / {{ logs.length }} </span>
            </p>
            <p class="content">{{ log.content }}</p>
            <p class="time">
              <span>[ </span>{{ logTime(log.timestamp) }}<span> ]</span>
            </p>
            <div class="round row" v-if="delineateRound(index, logs)">
              <b>Round {{ log.round - 1 }}</b>
            </div>
          </div>
        </div>
        <!--end wrapper-->
      </div>
    </div>
    <div class="footnote-wrapper row">
      <div class="footnote col-12">
        <h2>Thank you for playing.</h2>
        <div class="buttons">
          <router-link :to="'dashboard'">
            <button class="exit">Exit</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Vue } from 'vue-property-decorator';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { MarsLogMessageData } from '@port-of-mars/shared/types';
import _ from "lodash";

@Component({})
export default class Defeat extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  get logs() {
    return _.sortBy(this.$store.getters.logs, (ml) => - ml.id);
  }

  get categoryColorMap() {
    return this.$store.getters.categoryColorMap;
  }

  private logTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }

  private delineateRound(index: number, logs: MarsLogMessageData[]): boolean {
    let currentIndex: number = index;
    let nextIndex: number = index + 1;

    // console.log('currentIndex ', currentIndex);

    if (!logs[nextIndex]) {
      // console.log('undefined');
      return false;
    } else return logs[currentIndex].round !== logs[nextIndex].round;
  }
}
</script>

<style lang="scss" scoped>
@import '~animate.css/source/attention_seekers/pulse.css';
@import '@port-of-mars/client/stylesheets/root/Defeat.scss';
</style>
