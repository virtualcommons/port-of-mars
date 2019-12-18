<template>
  <div class="marslog">
    <p class="marslog-title">Mars Log</p>
    <div class="marslog-log">
      <p v-if="logs.length === 0" class="marslog-empty">
        No Logs
      </p>
      <div
        class="marslog-message"
        v-for="log in logs"
        :style="marsLogColor(log)"
        :key="log.timestamp"
      >
        <p class="marslog-message-category">{{ log.category }}</p>
        <p class="marslog-message-content">{{ log.content }}</p>
        <p class="marslog-message-time">
          <span>[ </span>{{ marsLogTime(log.timestamp) }}<span> ]</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class MarsLog extends Vue {
  updated() {
    const elem = this.$el.querySelector('.marslog-log');
    elem!.scrollTop = elem!.scrollHeight;
  }

  get logs() {
    return this.$tstore.getters.logs;
  }

  marsLogTime(timestamp: number) {
    console.log(timestamp);
    return new Date(timestamp).toLocaleTimeString();
  }

  // eslint-disable-next-line class-methods-use-this
  marsLogColor(log: object) {
    switch (log.category) {
      case 'Reduce Upkeep':
        return { backgroundColor: 'var(--marslog-red)' };
      case 'Trade':
        return { backgroundColor: 'var(--marslog-purple)' };
      default:
        return { backgroundColor: 'var(--space-white-opaque-1)' };
    }
  }
}
</script>

<style scoped>
.marslog {
  height: 100%;
  width: 100%;
  padding: 0.5rem;
  /* border: 0.125rem solid var(--space-white-opaque-2); */
  display: flex;
  flex-direction: column;
}

.marslog-title {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: var(--font-med);
  text-align: center;
  color: var(--space-gray);
  background-color: var(--space-orange);
}

.marslog-log {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.marslog-empty {
  margin-bottom: 0;
  font-size: var(--font-small);
  text-align: center;
  color: var(--space-white-opaque-2);
}

.marslog-log::-webkit-scrollbar {
  height: 0;
  width: 0;
}

.marslog-message {
  height: auto;
  max-width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: var(--font-small);
  color: var(--space-white);
  overflow: auto;
}

.marslog-message:last-child {
  margin-bottom: 0;
}

.marslog-message-category {
  margin: 0;
  color: var(--space-orange);
}

.marslog-message-content {
  margin: 0.5rem 0;
  word-wrap: break-word;
}

.marslog-message-time {
  margin: 0;
}

.marslog-message-time span {
  color: var(--space-orange);
}
</style>
