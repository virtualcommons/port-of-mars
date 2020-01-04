<template>
  <div class="chat" v-if="layout !== 'DISABLE_CHAT'">
    <p class="chat-title">Chat</p>
    <div class="chat-chat">
      <div class="chat-chat-container">
        <p v-if="messages.length === 0" class="chat-empty">
          No Messages
        </p>
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
    </div>
    <div class="chat-input-frame">
      <input
        class="chat-input"
        type="text"
        @keydown.enter="submitToChat"
        v-model="pendingMessage"
        placeholder="send a message"
      />
      <font-awesome-icon class="chat-input-sendbtn" :icon="['far', 'paper-plane']" size="lg" />
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons/faPaperPlane';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faPaperPlane);
Vue.component('font-awesome-icon', FontAwesomeIcon);

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
    return this.$tstore.state.eventView;
  }

  get messages() {
    return this.$tstore.state.messages;
  }

  toDate(unixTimestamp: number) {
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

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/Chat.scss';
</style>
