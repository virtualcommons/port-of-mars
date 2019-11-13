<template>
  <div class="marslog">
    <p class="marslog-title">Mars Log</p>
    <div class="marslog-log">
      <div
        class="marslog-message"
        v-for="message in messages"
        :key="message + Math.random()"
      >
        <!-- Need to change key to be time value, need to find package? -->
        <p class="marslog-message-content">
          <!-- <span class="marslog-message-header">{{ message.sender }}</span
          >: {{ message.content }} -->
          {{ message }}
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

  get messages() {
    return this.$store.state.marsLog;
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
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: var(--space-white);
}

.marslog-log {
  height: 100%;
  width: 100%;
  /* display: flex; */
  /* flex-direction: column; */
  border: 0.125rem solid var(--space-white);
  overflow-y: scroll;
  padding: 0.5rem;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
}

.marslog-log::-webkit-scrollbar { /* WebKit */
    width: 0;
    height: 0;
}

.marslog-message-content {
  /* height: auto; */
  /* max-width: 100%; */
  word-wrap: break-word;
  color: var(--space-white);
  margin: 0.5rem;
}

.marslog-message {
  color: var(--space-white);
  height: auto;
  max-width: 100%;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  /* background-color: white; */
  /* border-radius: .75rem; */
  overflow: auto;
  /* margin: 1rem 0.75rem 1rem 5rem; */
  background-color: rgba(245,245,245, 0.05);
}

.marslog-message-header {
  color: var(--space-orange);
}
</style>
