<template>
  <div id="chat" class="h-100 d-flex flex-column">
    <div id="messages" class="flex-grow-1 d-flex flex-column-reverse justify-content-start p-2">
      <div v-for="msg in reversedMessages" :key="msg.dateCreated"
        class="mt-2 backdrop rounded p-1"
      >
        <p class="mb-0">
          <b class="text-light">{{ msg.username }}: </b>
          <span class="text-secondary">{{ msg.message }}</span>
        </p>
      </div>
   </div>
    <div id="input" class="flex-shrink-1">
      <b-form @submit.stop.prevent="submitToChat" class="p-2" inline>
        <b-form-input v-model="pendingMessage"
          placeholder="Type a message..."
          autocomplete="off"
          class="flex-grow-1 mr-2"
          @keyup.enter="submitToChat"
        ></b-form-input>
        <b-button variant="secondary" type="submit" title="Send message">
          <b-icon-cursor></b-icon-cursor>
        </b-button>
      </b-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Inject, Vue } from "vue-property-decorator";
import { LobbyRequestAPI } from "@port-of-mars/client/api/lobby/request";
import { LobbyChatMessageData } from "@port-of-mars/shared/types";

@Component({})
export default class LobbyChat extends Vue {
  @Inject() readonly api!: LobbyRequestAPI;
  @Prop() messages!: Array<LobbyChatMessageData>;

  pendingMessage: string = "";

  get reversedMessages(): Array<LobbyChatMessageData> {
    return this.messages.slice().reverse();
  }

  updated() {
    const el = this.$el.querySelector("#messages");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  get pendingMessageCleaned(): string {
    return this.pendingMessage
      .trim()
      .replace(/(\n)/gm, " ");
  }

  async submitToChat() {
    if (this.pendingMessageCleaned && this.pendingMessageCleaned !== "") {
      await this.api.sendChatMessage(this.pendingMessageCleaned);
      this.pendingMessage = "";
    }
  }
}
</script>

<style lang="scss" scoped>
#messages {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100px;
}
</style>
