<template>
  <div class="lite-chat d-flex flex-column h-100">
    <div class="chat-header px-2 py-1">
      <h4>Chat</h4>
    </div>

    <div v-if="chatEnabled" class="chat-body d-flex flex-column flex-grow-1">
      <div
        class="messages flex-grow-1 overflow-auto px-2"
        ref="messagesScroll"
        @click="focusChatInput"
      >
        <p v-if="messages.length === 0" class="m-3 text-muted">No chat history to display.</p>
        <ChatMessage
          v-for="msg in messages"
          :key="msg.dateCreated"
          :message="msg"
          :showUsername="false"
        />
      </div>

      <div class="input-area p-2">
        <b-form-textarea
          no-resize
          rows="2"
          ref="chatInputRef"
          class="flex-grow-1"
          style="font-size: 0.95rem"
          @keydown.enter.exact.prevent="submitToChat"
          v-model="pendingMessage"
          placeholder="Type and press enter to send a message"
        />
        <div class="d-flex justify-content-end">
          <b-button variant="primary" size="sm" class="mt-2" @click="submitToChat">Send</b-button>
        </div>
      </div>
    </div>

    <div v-else class="h-100 w-100 d-flex justify-content-center align-items-center">
      <p class="m-0 p-0 text-center text-muted" style="font-weight: bold; font-size: 1rem">
        Chat is disabled this round.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue } from "vue-property-decorator";
import { LiteGameRequestAPI } from "@port-of-mars/client/api/pomlite/multiplayer/request";
import { ChatMessageData } from "@port-of-mars/shared/lite/types";
import ChatMessage from "@port-of-mars/client/components/game/static/chat/ChatMessage.vue";

@Component({
  components: { ChatMessage },
})
export default class LiteChat extends Vue {
  @Inject() readonly api!: LiteGameRequestAPI;

  @Prop({ required: true })
  messages!: ChatMessageData[];

  @Prop({ default: true })
  chatEnabled!: boolean;

  pendingMessage = "";

  get pendingMessageCleaned(): string {
    return this.pendingMessage.trim().replace(/(\n)/gm, " ");
  }

  focusChatInput() {
    const ref = this.$refs.chatInputRef as any;
    if (ref) ref.focus();
  }

  formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async submitToChat() {
    if (!this.chatEnabled) return;
    if (this.pendingMessageCleaned) {
      try {
        await this.api.sendChatMessage(this.pendingMessageCleaned);
        this.pendingMessage = "";
      } catch (error) {
        console.error("Failed to send chat message:", error);
      }
    }
  }

  updated() {
    const el = this.$refs.messagesScroll as HTMLElement | undefined;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
</script>

<style scoped>
.lite-chat {
  min-height: 0;
}
.chat-body {
  min-height: 0;
}
.messages {
  min-height: 0;
}
</style>
