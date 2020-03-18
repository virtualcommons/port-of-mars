<template>
  <div class="marslog tour-marslog">
    <p class="title">Mars Log</p>
    <div class="log">
      <p v-if="logs.length === 0" class="empty">
        No Logs
      </p>
      <div v-for="log in logs" :style="marsLogColor(log)" :key="log.timestamp" class="message">
        <p class="category">{{ log.category }}</p>
        <p class="content">{{ log.content }}</p>
        <p class="time"><span>[ </span>{{ marsLogTime(log.timestamp) }}<span> ]</span></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { MarsLogMessageData } from '@port-of-mars/shared/types';
import { MarsLogMessageData } from '../../../../../shared/types';

@Component({})
export default class MarsLog extends Vue {
  updated() {
    const elem = this.$el.querySelector('.log');
    elem!.scrollTop = elem!.scrollHeight;
  }

  get logs() {
    return this.$tstore.getters.logs;
  }

  marsLogTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }

  marsLogColor(log: MarsLogMessageData) {
    console.log(log.category)
    switch (log.category) {
      // case 'System Health':
      //   return { backgroundColor: 'var(--marslog-green)' };
      // case 'System Health':
      //   return { backgroundColor: 'var(--marslog-red)' };
      // case 'Trade':
      //   return { backgroundColor: 'var(--marslog-purple)' };
      // default:
      //   return { backgroundColor: 'var(--space-white-opaque-1)' };

      case 'System Health':
        return { backgroundColor: 'var(--marslog-red)' };
      case 'Event':
        return { backgroundColor: 'var(--marslog-orange)' };
      case 'Purchase Accomplishment':
        return { backgroundColor: 'var(--marslog-blue)' };
      case 'New Trade':
        return { backgroundColor: 'var(--marslog-purple)' };
      case 'Sent Trade':
        return { backgroundColor: 'var(--marslog-purple)' };
      case 'Accept Trade':
        return { backgroundColor: 'var(--marslog-green)' };
      case 'Reject Trade':
        return { backgroundColor: 'var(--marslog-purple-1)' };
      case 'Cancel Trade':
        return { backgroundColor: 'var(--marslog-grey)' };
      default:
        return { backgroundColor: 'var(--space-white-opaque-1)' };
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/left/MarsLog.scss';
</style>
