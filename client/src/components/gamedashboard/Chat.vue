<template>
  <div class="chat">
    <p class="chat-title">Chat</p>
    <div class="chat-chat">
      <div class="chat-message" v-for="message in messages" :key="message.time.getTime()">
        <!-- Need to change key to be time value, need to find package? -->
        <p class="chat-message-member">
          {{ message.sender }}
        </p>
        <p class="chat-message-content">
          {{ message.content }}
        </p>
        <p class="chat-message-time">
          <span>[ </span>{{ message.time.toLocaleTimeString() }}<span> ]</span>
        </p>
      </div>
    </div>
    <div class="chat-input-frame">
      <input
        class="chat-input"
        type="text"
        @keydown.enter="submitToChat"
        v-model="message"
        placeholder="send a message"
      />
      <button class="chat-input-sendbtn" type="button" @click="submitToChat">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { ChatMessage } from '@/models/index';

@Component({})
export default class Chat extends Vue {
  message: string = '';

  count: number = 0;

  updated() {
    const elem = this.$el.querySelector('.chat-chat');
    elem!.scrollTop = elem!.scrollHeight;
  }

  get messages() {
    return this.$store.state.chat.chat;
  }

  submitToChat() {
    if (this.message !== '') {
      const submittedMessage = {
        sender: this.$store.state.playerRole,
        content: this.message,
        time: new Date(),
      };

      this.$store.dispatch('sendChatMsg', submittedMessage);
      this.message = '';
    }
  }
}
</script>

<style lang="css" scoped>
.chat {
  height: 50%;
  width: 100%;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
}

.chat-title {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: #F5F5F5;
}

.chat-chat {
  height: 100%;
  width: 100%;
  padding: 0.5rem;
  border: 0.125rem solid #F5F5F5;
  border-bottom: none;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
}

.chat-chat::-webkit-scrollbar { /* WebKit */
    width: 0;
    height: 0;
}

.chat-message {
  padding: 0.5rem;
  color: #F5F5F5;
  height: auto;
  max-width: 100%;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  overflow: auto;
  background-color: rgba(245,245,245, 0.05);
}

.chat-message-member{
  margin: 0;
  color: #c67b5c;
}

.chat-message-content {
  margin: 0.5rem 0;
  word-wrap: break-word;
}

.chat-message-time {
  margin: 0
}

.chat-message-time span {
  color: #c67b5c;
}

.chat-input-frame {
  height: 3rem;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  border: 0.125rem solid #F5F5F5;
}

.chat-input {
  height: 100%;
  width: 75%;
  padding-right: 0.5rem;
  border: none;
  font-size: 0.75rem;
  color: #F5F5F5;
  background-color: #1e2223;
}

.chat-input:focus{
  outline: none;
}

.chat-input:active{
  outline: none;
}

.chat-input-sendbtn {
  height: 100%;
  width: 25%;
  border: none;
  font-size: 1rem;
  color: #C67B5C;
  background-color: #1e2223;
}

.chat-input-sendbtn:focus {
  outline: none;
}

.chat-input-sendbtn:active {
  outline: none;
}
</style>
