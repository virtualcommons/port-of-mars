<template>
  <div class="chat">
    <p class="chat-title">Chat</p>
    <div class="chat-chat">
      <div class="chat-message" v-for="message in messages" :key="message.time">
        <p class="chat-message-member">
          {{ message.role }}
        </p>
        <p class="chat-message-content">
          {{ message.message }}
        </p>
        <p class="chat-message-time"><span>[ </span>{{ toDate(message.time) }}<span> ]</span></p>
      </div>
    </div>
    <div class="chat-input-frame">
      <input
        class="chat-input"
        type="text"
        @keydown.enter="submitToChat"
        v-model="pendingMessage"
        placeholder="send a message"
      />
      <button class="chat-input-sendbtn" type="button" @click="submitToChat">Send</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import { ChatMessage } from '@/models/index';
import { RequestAPI } from '@/api/request';

@Component({})
export default class Chat extends Vue {
  @Inject()
  $api: RequestAPI;

  pendingMessage: string = '';

  count: number = 0;

  updated() {
    const elem = this.$el.querySelector('.chat-chat');
    elem!.scrollTop = elem!.scrollHeight;
  }

  get messages() {
    return this.$store.state.chat;
  }

  // eslint-disable-next-line class-methods-use-this
  toDate(unixTimestamp: number) {
    // Note: Does the new Date() function need to be called twice (Game.ts)?
    return new Date(unixTimestamp).toLocaleTimeString();
  }

  submitToChat() {
    if (this.pendingMessage !== '') {
      this.$api.sendChatMessage(this.pendingMessage);
      this.pendingMessage = '';
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
  margin: 0 0 0.5rem 0;
  font-size: var(--font-large);
  text-align: right;
  color: var(--space-white);
}

.chat-chat {
  height: 100%;
  width: 100%;
  padding: 0.5rem;
  border: var(--border-white);
  border-bottom: none;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.chat-chat::-webkit-scrollbar {
  /* WebKit */
  width: 0;
  height: 0;
}

.chat-message {
  height: auto;
  max-width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: var(--font-small);
  color: var(--space-white);
  background-color: rgba(245, 245, 245, 0.05);
  overflow: auto;
}

.chat-message-member {
  margin: 0;
  color: var(--space-orange);
}

.chat-message-content {
  margin: 0.5rem 0;
  word-wrap: break-word;
}

.chat-message-time {
  margin: 0;
}

.chat-message-time span {
  color: var(--space-orange);
}

.chat-input-frame {
  height: 3rem;
  width: 100%;
  padding: 0.5rem;
  border: var(--border-white);
  display: flex;
}

.chat-input {
  height: 100%;
  width: 75%;
  padding-right: 0.5rem;
  border: none;
  font-size: var(--font-small);
  color: var(--space-white);
  background-color: var(--space-gray);
}

.chat-input:focus {
  outline: none;
}

.chat-input:active {
  outline: none;
}

.chat-input-sendbtn {
  height: 100%;
  width: 25%;
  border: none;
  font-size: var(--font-med);
  color: var(--space-orange);
  background-color: var(--space-gray);
}

.chat-input-sendbtn:focus {
  outline: none;
}

.chat-input-sendbtn:active {
  outline: none;
}
</style>
