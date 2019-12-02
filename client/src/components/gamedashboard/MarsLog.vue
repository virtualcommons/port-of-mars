<template>
  <div class="marslog">
    <p class="marslog-title">Mars Log</p>
    <div class="marslog-log">
      <div
        class="marslog-message"
        v-for="log in logs"
        :style="marsLogColor(log)"
        :key="log.time"
      >
        <p class="marslog-message-category">{{ log.category }}</p>
        <p class="marslog-message-content">{{ log.content }}</p>
        <p class="marslog-message-time">
          <span>[ </span>{{ log.time }}<span> ]</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class MarsLog extends Vue {
  updated() {
    const elem = this.$el.querySelector('.marslog-log');
    elem!.scrollTop = elem!.scrollHeight;
  }

  get logs() {
    return this.$store.state.marsLog.marsLog;
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
  height: 50%;
  width: 100%;
  padding: 0.5rem;
  border: 0.125rem solid var(--space-white-opaque-2);
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
}

.marslog-title {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: var(--font-med);
  text-align: center;
  /* text-transform: uppercase; */
  color: var(--space-gray);
  background-color: var(--space-orange);
}

.marslog-log {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.marslog-log::-webkit-scrollbar {
  /* WebKit */
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
  /* background-color: var(--space-white-opaque-1); */
  overflow: auto;
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
