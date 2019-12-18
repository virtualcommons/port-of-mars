<template>
  <div class="chat v-step-16" v-if="layout !== 'DISABLE_CHAT'">
    <p class="chat-title">Chat</p>
    <div class="chat-chat">
      <div class="chat-message" v-for="message in messages" :key="message.dateCreated">
        <p class="chat-message-member">
          {{ message.role }}
        </p>
        <p class="chat-message-content">
          {{ message.message }}
        </p>
        <p class="chat-message-time">
          <span>[ </span>{{ toDate(message.dateCreated) }}<span> ]</span>
        </p>
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
      <i class="far fa-paper-plane fa-lg chat-input-sendbtn" @click="submitToChat"></i>
      <!-- <button class="chat-input-sendbtn" type="button" @click="submitToChat">Send</button> -->
    </div>
  </div>
  <div class="chat-disabled-container" v-else-if="layout === 'DISABLE_CHAT'">
    <div class="chat-disabled">
      <p>Chat is disabled this round.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject } from 'vue-property-decorator';
import { GameRequestAPI } from '@/api/game/request';

@Component({})
export default class Chat extends Vue {
  @Inject()
  $api!: GameRequestAPI;

  pendingMessage: string = '';

  count: number = 0;

  updated() {
    if (this.layout !== 'DISABLE_CHAT') {
      const elem = this.$el.querySelector('.chat-chat');
      elem!.scrollTop = elem!.scrollHeight;
    }
  }

  get layout() {
    console.log(`(${typeof this.$tstore.state.eventView}): ${this.$tstore.state.eventView}`);
    return this.$tstore.state.eventView;
  }

  get messages() {
    return this.$tstore.state.messages;
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

<style scoped>
.chat {
  height: 50%;
  width: 100%;
  padding: 0.5rem;
  border: 0.125rem solid var(--space-white-opaque-2);
  margin: 0.5rem 0 0 0;
  display: flex;
  flex-direction: column;
}

.chat-title {
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: var(--font-med);
  text-align: center;
  /* text-transform: uppercase; */
  color: var(--space-gray);
  background-color: var(--space-orange);
}

.chat-chat {
  height: 100%;
  width: 100%;
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
  background-color: var(--space-white-opaque-1);
  overflow: auto;
}

.chat-message:last-child {
  margin-bottom: 0;
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
  padding-top: 0.5rem;
  border-top: 0.125rem solid var(--space-white-opaque-2);
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-input {
  height: 100%;
  border: none;
  flex: 1;
  font-size: var(--font-small);
  color: var(--space-white);
  background-color: transparent;
}

.chat-input:focus {
  outline: none;
}

.chat-input:active {
  outline: none;
}

.chat-input::placeholder {
  color: var(--space-white-opaque-2);
}

.chat-input-sendbtn {
  margin-left: 0.5rem;
  color: var(--space-orange);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.chat-input-sendbtn:hover {
  transform: scale(1.1);
}

.chat-disabled-container {
  height: 50%;
  width: 100%;
  padding: 0.5rem;
  border: 0.125rem solid var(--space-white-opaque-2);
  margin-top: 2rem;
}

.chat-disabled {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--space-white);
  background-color: var(--space-white-opaque-1);
}

.chat-disabled p {
  font-size: var(--font-small);
  text-align: center;
  margin-bottom: 0;
}
</style>
