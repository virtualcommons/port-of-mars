<template>
  <div class="victory">
      <!-- TITLE -->
      <div class="title-wrapper">
        <div class="title col-12">
          <h1>Port of Mars</h1>
          <h2>Winners</h2>
          <div v-for="winner in winners" class="d-flex flex-row">
            <p>{{ winner }}</p>
          </div>
        </div>
      </div>

      <!-- SUBTITLE -->
      <div class="content-wrapper">
        <div class="content">
          <h2>Despite all doubts, you have successfully established an extraterrestrial society. Thanks to you, future generations
            can flourish on planet Mars.</h2>
        </div>
      </div>

      <!-- MARS LOG -->
      <div class="marslog-wrapper">
        <div class="marslog col-6">
          <div class="wrapper">
            <div
              :key="log.timestamp"
              :style="{ backgroundColor: categoryColorMap.get(log.category) }"
              class="message"
              v-for="(log, index) in logs"
            >
              <p class="category">{{ log.category }}</p>
              <p class="final-log" v-if="index === 0">Final Log</p>
              <p class="list" v-if="index !== 0">
              <span>
                Log: {{ logs.length - index }} / {{ logs.length }}
              </span>
              </p>
              <p class="content">{{ log.content }}</p>
              <p class="time">
                <span>[ </span>{{ logTime(log.timestamp) }}<span> ]</span>
              </p>
              <div class="round" v-if="delineateRound(index, logs)"><b>Round {{ log.round - 1
                }}</b></div>
            </div>
          </div> <!--end wrapper-->
        </div>
      </div>

      <!-- FOOTER -->
      <div class="footnote-wrapper">
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
import { Vue, Component, InjectReactive, Inject } from 'vue-property-decorator';
import { GameRequestAPI } from '@port-of-mars/client/api/game/request';
import { MarsLogMessageData } from "@port-of-mars/shared/types";

@Component({})
export default class Victory extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  get logs() {
    return this.$store.getters.logs.reverse();
  }

  get categoryColorMap() {
    return this.$store.getters.categoryColorMap;
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

  get winners() {
    return this.$tstore.state.winners;
  }
}
</script>

<style lang="scss" scoped>
@import '~animate.css/source/attention_seekers/pulse.css';
@import '@port-of-mars/client/stylesheets/root/Victory.scss';
</style>
