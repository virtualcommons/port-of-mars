<template>
  <div v-if="layout !== 'DISABLE_CHAT'" class="chat tour-chat">
    <p class="title">Chat</p>

    <div class="messages-view">
      <div class="wrapper">
        <p v-if="messages.length === 0" class="empty">
          No Messages
        </p>
        <div
          v-for="message in messages"
          :key="message.dateCreated + Math.random()"
          :style="getMessageColor(message)"
          class="message"
        >
          <div class="top">
            <p class="member">
              {{ message.role }}
            </p>
            <p class="time">
              <span>[ </span>{{ toDate(message.dateCreated) }}<span> ]</span>
            </p>
          </div>
          <div class="bottom">
            <p class="content">
              {{ message.message }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="input-frame">
      <input
        class="chat-input"
        @keydown.enter="submitToChat"
        v-model="pendingMessage"
        type="text"
        placeholder="send a message"
      />
      <font-awesome-icon
        :icon="['far', 'paper-plane']"
        :class="sendBtnClass"
        @click="submitToChat"
        size="lg"
      />
    </div>
  </div>
  <div v-else-if="layout === 'DISABLE_CHAT'" class="chat-disabled">
    <div class="wrapper">
      <p>Chat is disabled this round.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, InjectReactive, Inject } from 'vue-property-decorator';
import { GameRequestAPI } from '@/api/game/request';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons/faPaperPlane';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ChatMessageData } from 'shared/types';

library.add(faPaperPlane);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({})
export default class Chat extends Vue {
  @Inject() readonly api!: GameRequestAPI;

  private pendingMessage: string = '';

  private count: number = 0;

  mounted() {
    if (this.messages) {
      // console.log(this.messages);
    }
  }

  get sendBtnClass(): string {
    return this.pendingMessage.length === 0 ? 'chat-input-sendbtn' : 'chat-input-sendbtn--ready';
  }

  get layout(): any {
    return this.$store.getters.currentEventView;
  }

  get messages(): any {
    return this.$tstore.state.messages;
  }

  private updated(): any {
    if (this.layout !== 'DISABLE_CHAT') {
      const elem = this.$el.querySelector('.messages-view');
      elem!.scrollTop = elem!.scrollHeight;
    }
  }

  private toDate(unixTimestamp: number): any {
    return new Date(unixTimestamp).toLocaleTimeString();
  }

  private submitToChat(): void {
    console.log('MESSAGE: ', this.pendingMessage);
    if (this.pendingMessage && this.pendingMessage !== '') {
      console.log('MESSAGE: NOT EMPTY');
      this.api.sendChatMessage(this.pendingMessage);
      this.pendingMessage = '';
    }
  }

  private getMessageColor(message: ChatMessageData): object {
    if (message.role) {
      return { backgroundColor: `var(--color-${message.role})` };
    }
    return { backgroundColor: 'var(--space-white-opaque-1)' };
  }
}
</script>

<style lang="scss" scoped>
@import '@/stylesheets/gamedashboard/right/Chat.scss';
</style>
