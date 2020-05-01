<template>
  <div class="c-marslog">
    <div class="wrapper">
      <p v-if="logs.length === 0" class="empty">
        No Logs
      </p>
      <div
        v-for="log in logs"
        :style="{ backgroundColor: categoryColorMap.get(log.category) }"
        :key="log.timestamp + Math.random()"
        class="message"
      >
        <p class="category">{{ log.category }}</p>
        <p class="content">{{ log.content }}</p>
        <p class="time">
          <span ><span class="timestamp"> [ </span>{{ logTime(log.timestamp) }}<span class="timestamp"> ]</span></span>
          <span class="round">ROUND {{ log.round }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { MarsLogData, MarsLogCategory } from '@port-of-mars/shared/types';

@Component({
  components: {},
})
export default class MarsLog extends Vue {

  updated() {
    const elem = this.$el.querySelector('.wrapper');
    elem!.scrollTop = elem!.scrollHeight;
  }

  get logs() {
    return this.$tstore.getters.logs;
  }

  get categoryColorMap() {
    return this.$store.getters.categoryColorMap;
  }

  logTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }

}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/game/MarsLog.scss';
</style>
