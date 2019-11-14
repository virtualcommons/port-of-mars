<template>
  <div class="marslog">
    <p class="marslog-title">Mars Log</p>
    <div class="marslog-log">
      <div
        class="marslog-message"
        v-for="log in logs"
        :key="log.time.getTime()"
      >
        <!-- Need to change key to be time value, need to find package? -->
        <p class="marslog-message-category">{{ log.category }}</p>
        <p class="marslog-message-content">{{ log.content }}</p>
        <p class="marslog-message-time">
          <span>[ </span>{{ log.time.toLocaleTimeString() }}<span> ]</span>
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
}
</script>

<style scoped>
.marslog {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 50%;
  /* background-color: blue; */
}

.marslog-title {
  font-size: var(--font-large);
  margin: 0 0 0.5rem 0;
  color: var(--space-white);
}

.marslog-log {
  height: 100%;
  width: 100%;
  /* display: flex; */
  /* flex-direction: column; */
  border: var(--border-white);
  overflow-y: scroll;
  padding: 0.5rem;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
}

.marslog-log::-webkit-scrollbar { /* WebKit */
    width: 0;
    height: 0;
}

/* .marslog-message-content {
  word-wrap: break-word;
  color: var(--space-white);
  margin: 0.5rem;
} */

.marslog-message {
  padding: 0.5rem;
  color: var(--space-white);
  height: auto;
  max-width: 100%;
  font-size: var(--font-small);
  margin-bottom: 0.5rem;
  overflow: auto;
  background-color: rgba(245,245,245, 0.05);
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
  margin: 0
}

.marslog-message-time span {
  color: var(--space-orange);
}
</style>
