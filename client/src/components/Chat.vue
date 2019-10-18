<template>
  <div class="chat">
    <p class="chat-title">Chat</p>
    <div class="chat-chat">

    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component

export default class Chat extends Vue {}
</script>

<style lang="css" scoped>
.chat {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 50%;
  /* background-color: blue; */
}

.chat-title {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: #F5F5F5;
}

.chat-chat {
  height: 100%;
  border: 0.125rem solid #F5F5F5;
}
</style>
