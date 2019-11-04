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
  get messages() {
    return this.$store.state.marsLog;
  }
}
</script>

<style scoped>
.marslog {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 50%;
  /* background-color: blue; */
}

.marslog-title {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: #f5f5f5;
}

.marslog-log {
  height: 100%;
  width: 100%;
  /* display: flex; */
  /* flex-direction: column; */
  border: 0.125rem solid #F5F5F5;
  border-bottom: none;
  overflow-y: scroll;
  padding: 0.5rem;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
}

.marslog-message-content {
  /* height: auto; */
  /* max-width: 100%; */
  word-wrap: break-word;
  color: #F5F5F5;
  margin: 0.5rem;
}

.marslog-message {
  color: #F5F5F5;
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
  color: #C67B5C;
}
</style>
