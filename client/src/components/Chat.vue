<template>
  <div class="chat">
    <p class="chat-title">Chat</p>
    <div class="chat-chat">
      <p class="chat-message" v-for="message in messages" :key="message">
        {{ message }}
      </p>
    </div>
    <input type="text" @keydown.enter="submitToChat" v-model="message">
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({

})

export default class Chat extends Vue {
  message: string = '';

  get messages() {
    return this.$store.state.chat;
  }

  async submitToChat() {
    await this.$store.dispatch('sendChatMsg', this.message);
    this.message = '';
  }
}
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
  min-height: 100%;
  max-height: 100%;
  border: 0.125rem solid #F5F5F5;
  overflow-y: auto;
}

.chat-message {
  color: #F5F5F5;
}
</style>
