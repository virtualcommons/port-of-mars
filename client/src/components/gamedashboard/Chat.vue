<template>
  <div class="chat">
    <p class="chat-title">Chat</p>
    <div class="chat-chat">
      <div class="chat-message" v-for="message in messages" :key="message.content + Math.random()">
        <!-- Need to change key to be time value, need to find package? -->
        <p class="chat-message-content">
          <span class="chat-message-header">{{ message.sender }}</span
          >: {{ message.content }}
        </p>
      </div>
    </div>
    <div class="chat-input-frame">
      <input class="chat-input" type="text" @keydown.enter="submitToChat" v-model="message" />
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
    elem.scrollTop = elem.scrollHeight;
  }

  get messages() {
    return this.$store.state.chat.chat;
  }

  submitToChat() {
    const submittedMessage = {
      sender: this.$store.state.playerRole,
      content: this.message,
    };

    this.$store.dispatch('sendChatMsg', submittedMessage);
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

.chat-chat::-webkit-scrollbar { /* WebKit */
    width: 0;
    height: 0;
}

.chat-message {
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

.chat-message-header{
  color: #C67B5C;
}

.chat-message-content{
  /* height: auto; */
  /* max-width: 100%; */
  word-wrap: break-word;
  color: #F5F5F5;
  margin: 0.5rem;
}

.chat-input-frame {
  height: 3rem;
  width: 100%;
  border: 0.125rem solid #F5F5F5;
  display: flex;
}

.chat-input {
  height: 100%;
  width: 80%;
  padding: 0.5rem;
  font-size: 1rem;
  color: #F5F5F5;
  border: none;
  background-color: #1E2223;
}

.chat-input:focus{
  outline: none;
}

.chat-input:active{
  outline: none;
}

.chat-input-sendbtn {
  height: 100%;
  width: 20%;
  border: none;
  font-size: 1rem;
  color: #C67B5C;
  background-color: #1E2223;
}

.chat-input-sendbtn:focus {
  outline: none;
}

.chat-input-sendbtn:active {
  outline: none;
}
</style>
