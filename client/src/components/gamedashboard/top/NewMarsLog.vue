<template>
  <div class="c-marslog">
    <div class="wrapper">
      <p v-if="logs.length === 0" class="empty">
        No Logs
      </p>
      <div
        v-for="log in logs"
        :style="marsLogColor(log)"
        :key="log.timestamp"
        class="message"
      >
        <p class="category">{{ log.category }}</p>
        <p class="content">{{ log.content }}</p>
        <p class="time">
          <span>[ </span>{{ marsLogTime(log.timestamp) }}<span> ]</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { MarsLogData } from '@port-of-mars/shared/types';

@Component({
  components: {}
})
export default class NewMarsLog extends Vue {
  private logs: Array<MarsLogData> = [
    {
      category: 'test',
      content: 'TEST LOG MESSAGE 1',
      performedBy: 'Researcher',
      timestamp: 1585072487970
    },
    {
      category: 'test',
      content: 'TEST LOG MESSAGE 2',
      performedBy: 'Researcher',
      timestamp: 1585072487970
    },
    {
      category: 'test',
      content: 'TEST LOG MESSAGE 3',
      performedBy: 'Researcher',
      timestamp: 1585072487970
    },
    {
      category: 'test',
      content: 'TEST LOG MESSAGE 4',
      performedBy: 'Researcher',
      timestamp: 1585072487970
    },
    {
      category: 'test',
      content: 'TEST LOG MESSAGE 5',
      performedBy: 'Researcher',
      timestamp: 1585072487970
    },
    {
      category: 'test',
      content: 'TEST LOG MESSAGE 6',
      performedBy: 'Researcher',
      timestamp: 1585072487970
    }
  ];

  updated() {
    const elem = this.$el.querySelector('.wrapper');
    elem!.scrollTop = elem!.scrollHeight;
  }

  //   get logs() {
  //     return this.$tstore.getters.logs;
  //   }

  marsLogTime(timestamp: number) {
    return new Date(timestamp).toLocaleTimeString();
  }

  marsLogColor(log: MarsLogData) {
    console.log(log.category);
    switch (log.category) {
      case 'System Health: Gain':
        return { backgroundColor: 'var(--marslog-green)' };
      case 'System Health: Drop':
        return { backgroundColor: 'var(--marslog-red)' };
      case 'Trade':
        return { backgroundColor: 'var(--marslog-purple)' };
      default:
        return { backgroundColor: 'var(--space-white-opaque-1)' };
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@port-of-mars/client/stylesheets/gamedashboard/top/NewMarsLog.scss';
</style>
